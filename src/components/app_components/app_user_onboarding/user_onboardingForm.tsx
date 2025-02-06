"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Loader } from "@/components/app_components/app_loader/__loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { __debounce } from "@/lib/debounce";
import { MapPin } from "lucide-react";
import type { Location } from "@/interfaces/app_database_models";
import { useLocationSuggestion } from "@/hooks/location_suggestion/use-suggestion";
import { TagInput } from "@/components/ui/tag-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { createUserWithSkillsAndLocation } from "../../../../actions/user_apis";

// Separate components for each form section
const BasicInfo = React.memo(
  ({
    formData,
    handleInputChange,
    errors,
  }: {
    formData: any;
    handleInputChange: any;
    errors: any;
  }) => (
    <>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={formData?.avatar} alt={formData?.name} />
          <AvatarFallback>{formData?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="space-y-2">
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="border-gray-700 text-white h-[4rem] text-xl"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <Input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          disabled
          className="border-gray-700 text-white h-[4rem] text-xl"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
    </>
  )
);

const Bio = React.memo(
  ({
    formData,
    handleInputChange,
    errors,
  }: {
    formData: any;
    handleInputChange: any;
    errors: any;
  }) => (
    <>
      <Textarea
        name="bio"
        value={formData.bio}
        onChange={handleInputChange}
        placeholder="Bio"
        className="h-40 border-gray-700 text-white text-xl"
      />
      {errors.bio && <p className="text-red-500">{errors.bio}</p>}
    </>
  )
);

const LocationSection = React.memo(
  ({
    formData,
    handleLocationChange,
    loading,
    suggestions,
    setSelectedSuggestion,
    setSuggestions,
    setFormData,
    errors,
  }: {
    formData: any;
    handleLocationChange: any;
    errors: any;
    loading: boolean;
    suggestions: any;
    setSelectedSuggestion: any;
    setSuggestions: any;
    setFormData: any;
  }) => (
    <>
      <div className="relative">
        <Input
          name="location"
          value={formData.location} // Bind to formData.location
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder="Location"
          className="bg-white/5 backdrop-blur-lg h-[4rem] text-xl text-white border-gray-700"
        />
        <MapPin className="absolute text-white right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
      </div>
      {errors.location && <p className="text-red-500">{errors.location}</p>}
      {loading && (
        <div className="h-[10rem] flex justify-center items-center bg-gray-800 rounded-md">
          <Loader className="text-white" />
        </div>
      )}
      {suggestions.length > 0 && !loading && (
        <ul className="mt-1 max-h-60 overflow-auto rounded-md bg-gray-800 py-1 text-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-md">
          {suggestions.map((suggestion: any, index: number) => (
            <li
              key={index}
              className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                setSelectedSuggestion(suggestion);
                const fullLocation = `${suggestion.city}, ${
                  suggestion.state ? suggestion.state + ", " : ""
                }${suggestion.country}`;
                setFormData((prevData: any) => ({
                  ...prevData,
                  location: fullLocation, // Update state here!
                }));
                setSuggestions([]);
              }}
            >
              {suggestion.city}, {suggestion.state && `${suggestion.state}, `}
              {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </>
  )
);

const Skills = React.memo(
  ({
    formData,
    setFormData,
    errors,
  }: {
    formData: any;
    setFormData: any;
    errors: any;
  }) => (
    <div className="space-y-4">
      <div>
        <label htmlFor="skills" className="text-white text-xl block mb-2">
          Skills (Put Values & Hit Enter/Comma)
        </label>
        <TagInput
          id="skills"
          tags={formData.skills}
          setTags={(newTags) =>
            setFormData((prevData: any) => ({ ...prevData, skills: newTags }))
          }
          maxTags={20}
        />
      </div>
      <div>
        <label htmlFor="githubId" className="text-white text-xl block mb-2">
          Github Username
        </label>
        <Input
          type="text"
          name="githubId"
          value={formData.githubId}
          onChange={(e) =>
            setFormData((prevData: any) => ({
              ...prevData,
              githubId: e.target.value,
            }))
          }
          className="bg-white/5 backdrop-blur-lg h-[4rem] text-xl text-white border-gray-700"
        />
        {errors.experience && (
          <p className="text-red-500">{errors.experience}</p>
        )}
      </div>
      <div>
        <label htmlFor="experience" className="text-white text-xl block mb-2">
          Years of Experience
        </label>
        <Input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={(e) =>
            setFormData((prevData: any) => ({
              ...prevData,
              experience: e.target.value,
            }))
          }
          className="bg-white/5 backdrop-blur-lg h-[4rem] text-xl text-white border-gray-700"
        />
        {errors.experience && (
          <p className="text-red-500">{errors.experience}</p>
        )}
      </div>
      <div>
        <label htmlFor="interests" className="text-white text-xl block mb-2">
          Interests
        </label>
        <TagInput
          id="interests"
          tags={formData.interests}
          setTags={(newTags) =>
            setFormData((prevData: any) => ({
              ...prevData,
              interests: newTags,
            }))
          }
          maxTags={10}
        />
      </div>
    </div>
  )
);

const UserOnboardingForm = () => {
  const router = useRouter();
  const { user, user_loading, setUser } = useFirebaseStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Location | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    location: "",
    skills: [] as string[],
    experience: 0,
    interests: [] as string[],
    githubId: "",
  });

  const formSections = useMemo(
    () => ["Basic Info", "Bio", "Location", "Skills"],
    []
  );

  const { loading, setSuggestions, fetchSuggestions, suggestions } =
    useLocationSuggestion();

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.displayName || "",
        email: user.email || "",
        avatar: user.photoURL || "",
      }));
    }
  }, [user]);

  const debouncedGetSuggestions = useCallback(
    __debounce(async (value: string) => {
      if (value.length > 2) {
        await fetchSuggestions(value);
      }
    }, 300),
    [] // Removed unnecessary dependencies
  );

  const handleLocationChange = useCallback(
    (value: string) => {
      if (value.length === 0) {
        setSuggestions([]);
        setSelectedSuggestion(null);
      }
      setFormData((prevData) => ({ ...prevData, location: value }));
      debouncedGetSuggestions(value);
    },
    [
      debouncedGetSuggestions,
      setFormData,
      setSelectedSuggestion,
      setSuggestions,
    ]
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (formData.bio.length < 20 || formData.bio.length > 500) {
      newErrors.bio = "Bio must be between 20 and 500 characters.";
    }

    if (formData.experience < 0 || formData.experience > 50) {
      newErrors.experience = "Experience must be between 0 and 50 years.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    []
  );

  // using server action inside a function for submission
  const create_user = async (formData: any, location_data: any) => {
    if (!location_data) {
      toast.error(
        "Please select a valid location, from suggestion and try again"
      );
    }
    const { created_user, success, error, message } =
      await createUserWithSkillsAndLocation(
        user.uid,
        formData.name,
        formData.email,
        formData.githubId,
        formData.avatar,
        formData.bio,
        formData.skills,
        formData.interests,
        formData.experience,
        location_data
      );

    if (success) {
      toast.success(message, {
        duration: 5000,
      });
      console.log("created user - ", created_user);
      const final_user = {
        ...user,
        ...created_user,
      };
      setUser(final_user);
      router.push("/");
    } else {
      toast.error(message);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // console.log("handleSubmit called");

      if (!validateForm()) {
        console.log("Form validation failed");
        return;
      }

      // console.log("Form is valid, submitting...");
      setIsLoading(true);

      try {
        await create_user(formData, selectedSuggestion);
      } catch (error) {
        console.error("Failed to update profile:", error);
        // Optionally, show an error message to the user
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm]
  );

  const renderCurrentSection = useCallback(() => {
    switch (currentSection) {
      case 0:
        return (
          <BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <Bio
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <LocationSection
            formData={formData}
            handleLocationChange={handleLocationChange}
            loading={loading}
            suggestions={suggestions}
            setSelectedSuggestion={setSelectedSuggestion}
            setSuggestions={setSuggestions}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Skills
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  }, [
    currentSection,
    formData,
    handleInputChange,
    errors,
    handleLocationChange,
    loading,
    suggestions,
    setSelectedSuggestion,
    setSuggestions,
    setFormData,
  ]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="h-screen z-10 flex flex-col gap-2 justify-center items-center"
      >
        <Loader className="text-white" />
        <span className="font-playwrite text-blue-400 font-light">
          Creating User...
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[95%] md:w-full max-w-2xl z-10 md:mt-[3rem] py-24"
    >
      <Card className="w-full text-black bg-black border-gray-700">
        <CardTitle className="text-center pt-5 text-xl font-sans text-white">
          Complete Your <span className="text-blue-500"> Profile </span>
        </CardTitle>
        {!user_loading && (
          <CardHeader>
            <Progress
              value={(currentSection / (formSections.length - 1)) * 100}
              className="w-full h-2"
            />
          </CardHeader>
        )}
        {user_loading ? (
          <div className="h-[20rem] flex justify-center items-center">
            <Loader className="text-white" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentSection()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                onClick={() => setCurrentSection((s) => Math.max(s - 1, 0))}
                disabled={currentSection === 0}
                variant="outline"
                className="text-black border-black hover:bg-white/80 disabled:opacity-50 text-md"
              >
                Previous
              </Button>
              {currentSection < formSections.length - 1 ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentSection((s) =>
                      Math.min(s + 1, formSections.length - 1)
                    );
                  }}
                  variant="outline"
                  className="bg-black text-white hover:bg-gray-900 hover:text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="outline"
                  className="bg-black text-white hover:bg-gray-900 hover:text-white disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </CardFooter>
          </form>
        )}
      </Card>
    </motion.div>
  );
};

export default React.memo(UserOnboardingForm);
