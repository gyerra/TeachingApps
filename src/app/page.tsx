"use client";
import { useForm, FormProvider } from "react-hook-form";
import DiscussionPromptForm from '@/components/DiscussionPromptForm';

export default function Page() {
  const methods = useForm(); // Ensure useForm is used correctly

  return (
    <FormProvider {...methods}>
      <DiscussionPromptForm isLoading={false} />
    </FormProvider>
  );
}
