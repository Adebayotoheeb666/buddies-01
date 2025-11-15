import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

interface EnhancedSignupData extends z.infer<typeof SignupValidation> {
  major?: string;
  class_year?: string;
  university_id?: string;
  pronouns?: string;
  graduation_year?: number;
  interests?: string;
}

const EnhancedSignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const [step, setStep] = useState(1);
  const [emailVerified, setEmailVerified] = useState(false);

  const form = useForm<EnhancedSignupData>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      major: "",
      class_year: "",
      university_id: "",
      pronouns: "",
      graduation_year: new Date().getFullYear() + 4,
      interests: "",
    },
  });

  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } =
    useSignInAccount();

  const verifyUniversityEmail = async () => {
    const email = form.getValues("email");
    if (!email.endsWith("@university.edu") && !email.endsWith(".edu")) {
      toast({ title: "Please use a valid university email address (.edu)" });
      return;
    }
    setEmailVerified(true);
    setStep(2);
    toast({ title: "Email verified! Continue with your profile information." });
  };

  const handleSignup = async (user: EnhancedSignupData) => {
    if (!emailVerified) {
      toast({ title: "Please verify your university email first." });
      return;
    }

    try {
      const newUser = await createUserAccount({
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again." });
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });
        navigate("/sign-in");
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });
        return;
      }
    } catch (error) {
      console.log({ error });
      toast({ title: "An error occurred. Please try again." });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={36}
            height={36}
          />
          <span className="h3-bold md:h2-bold text-primary-500">Buddies</span>
        </div>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          {step === 1 ? "Join Our Community" : "Create Your Profile"}
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          {step === 1
            ? "Verify your university email to get started"
            : "Tell us about yourself"}
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          {/* STEP 1: Basic Info & Email Verification */}
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      University Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="shad-input"
                        placeholder="student@university.edu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="shad-button_primary"
                onClick={verifyUniversityEmail}>
                Verify Email
              </Button>
            </>
          )}

          {/* STEP 2: Profile Info */}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Major</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input"
                        placeholder="e.g., Computer Science"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Class Year
                    </FormLabel>
                    <FormControl>
                      <select className="shad-input" {...field}>
                        <option value="">Select class year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="graduation_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Graduation Year
                    </FormLabel>
                    <FormControl>
                      <Input type="number" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pronouns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Pronouns</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input"
                        placeholder="e.g., She/Her"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Interests (comma separated)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input"
                        placeholder="e.g., Coding, Research"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  className="flex-1 bg-dark-3 text-light-1 font-semibold hover:bg-dark-4"
                  onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1 shad-button_primary">
                  {isCreatingAccount || isSigningInUser || isUserLoading ? (
                    <div className="flex-center gap-2">
                      <Loader /> Creating...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </>
          )}

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default EnhancedSignupForm;
