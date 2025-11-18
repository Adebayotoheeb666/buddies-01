import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getUserFriendlyError, logError } from "@/lib/utils/errorHandler";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, context?: Record<string, any>) => {
      const userMessage = getUserFriendlyError(error);
      logError(userMessage, error, context);

      toast({
        variant: "destructive",
        title: "Error",
        description: userMessage,
      });

      return userMessage;
    },
    [toast]
  );

  const handleApiError = useCallback(
    (error: unknown, actionName: string, context?: Record<string, any>) => {
      const userMessage = getUserFriendlyError(error);
      logError(`${actionName} failed: ${userMessage}`, error, context);

      toast({
        variant: "destructive",
        title: "Failed to " + actionName,
        description: userMessage,
      });

      return userMessage;
    },
    [toast]
  );

  const showSuccess = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
      });
    },
    [toast]
  );

  const showInfo = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
      });
    },
    [toast]
  );

  return {
    handleError,
    handleApiError,
    showSuccess,
    showInfo,
  };
};
