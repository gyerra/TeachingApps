import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Loader2, Copy } from "lucide-react";
import {
  countries,
  boardsByCountry,
  subjects,
} from "../components/constants/education-data";
import History from "./History"; // Ensure correct import

const DiscussionPromptForm: React.FC<{ isLoading: boolean }> = ({
  isLoading,
}) => {
  const { control, handleSubmit, watch } = useFormContext();
  const selectedCountry = watch("country");

  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generatePrompts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}` // Ensure this is set in env variables
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setPrompts(result.prompts);

      // Save generated prompts to backend
      await fetch("/api/saveGeneratedOutputs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ outputs: result.prompts.map((text: string, index: number) => ({ id: index + 1, text, date: new Date().toISOString() })) }),
      });
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        alert(`Failed to generate prompts: ${error.message}`);
      } else {
        alert("Failed to generate prompts: An unknown error occurred.");
      }
    }
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <Link href="/tools">
        <Button variant="outline" className="mb-2 border-neutral-500">
          ← Back
        </Button>
      </Link>

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-rose-500">
          Discussion Prompts Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Spark insightful discussions and critical thinking with AI-generated prompts tailored for students.
        </p>
      </div>

      <Card className="shadow-lg border-2">
        <CardContent className="p-6 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Country and Board Selection */}
            <div className="grid md:grid-cols-2 gap-8">
              <FormItem>
                <FormLabel><b>Country</b></FormLabel>
                <Controller
                  name="country"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="w-full h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select country..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>

              <FormItem>
                <FormLabel><b>Educational Board</b></FormLabel>
                <Controller
                  name="board"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="w-full h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select board..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                        {selectedCountry &&
                          boardsByCountry[selectedCountry]?.map((board) => (
                            <SelectItem key={board.value} value={board.value}>
                              {board.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>
            </div>

            {/* Subject, Grade */}
            <div className="grid md:grid-cols-3 gap-8">
              <FormItem>
                <FormLabel><b>Subject</b></FormLabel>
                <Controller
                  name="subject"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="w-full h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select subject..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>

              <FormItem>
                <FormLabel><b>Grade Level</b></FormLabel>
                <Controller
                  name="gradeLevel"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="w-full h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select grade..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Grade {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>
            </div>

            {/* Topic for Discussion */}
            <FormItem>
              <FormLabel><b>Topic for Discussion</b></FormLabel>
              <Controller
                name="topic"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter topic for discussion"
                    className="h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              />
            </FormItem>

            {/* Time Limit and Engagement Level */}
            <div className="grid md:grid-cols-2 gap-8">
              <FormItem>
                <FormLabel><b>Time Limit for Discussion (minutes)</b></FormLabel>
                <Controller
                  name="timeLimit"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="5"
                      max="180"
                      placeholder="Enter time limit in minutes"
                      className="h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                />
              </FormItem>

              <FormItem>
                <FormLabel><b>Engagement Level</b></FormLabel>
                <Controller
                  name="engagementLevel"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="w-full h-11 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select engagement level..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                        <SelectItem value="quick discussion">Quick Discussion</SelectItem>
                        <SelectItem value="in-depth debate">In-Depth Debate</SelectItem>
                        <SelectItem value="structured panel">Structured Panel Talk</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>
            </div>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
              {loading ? <Loader2 className="animate-spin text-white" /> : "Generate Prompts"}
            </Button>
          </form>

          {prompts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Generated Prompts:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {prompts.map((prompt, index) => (
                  <li key={index} className="flex items-center">
                    <span>{prompt}</span>
                    <button
                      onClick={() => handleCopy(prompt)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <History /> {/* Add History component here */}
    </div>
  );
};

export default DiscussionPromptForm;
