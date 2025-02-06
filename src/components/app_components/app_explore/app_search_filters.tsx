"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FilterIcon, Search, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getDevelopersBySkills,
  getTopskills,
} from "../../../../actions/user_apis";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { __debounce } from "@/lib/debounce";
import { useLocationSuggestion } from "@/hooks/location_suggestion/use-suggestion";
import { useSearchFilters } from "@/hooks/use-search_filters";
import { Loader } from "../app_loader/__loader";
import { useGetTopSkills } from "@/hooks/use-get_top_skills";
import { useSuggestSkills } from "@/hooks/use-suggest_skills";

type Props = {};

const ExplorePageSearchFilters = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceLevel, setExperienceLevel] = useState([0, 50]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSticky, setIsSticky] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    // console.log(selectedSkills);
    const { developers, success, message } = await getDevelopersBySkills(
      selectedSkills
    );
    if (!success) {
      console.log("Error fetching developers");
      return toast.error(message || "Error fetching developers");
    }
    const skills = developers?.map((dev) => {
      return dev?.skills?.map((skill) => skill.name);
    });
    console.log(skills);
    // console.log("Searching for:", searchTerm);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <>
      <Card className="bg-white/5 hidden lg:block backdrop-blur-lg border-none shadow-2xl text-white">
        <CardHeader>
          <CardTitle className="tracking-wide">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="ml-2">
                <Search />
              </Button>
            </div>

            <div className="rounded-full">
              <label className="block mb-2">Experience Level</label>
              <Slider
                defaultValue={[0]}
                max={50}
                step={1}
                value={experienceLevel}
                className="bg-white rounded-full border-none ouline-none"
                onValueChange={(vals) => {
                  setExperienceLevel((prev) => [vals[0], prev[1]]);
                }}
              />
              <div className="flex justify-between text-sm mt-2">
                <span>{experienceLevel[0]} years</span>
                <span>{experienceLevel[1]} years</span>
              </div>
            </div>

            <div>
              <Input placeholder="Search Skills..." />
            </div>

            <div>
              <label className="block mb-2">Top Skills</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Node.js",
                  "Python",
                  "Java",
                  "C#",
                  "Ruby",
                  "Go",
                  "Rust",
                ].map((skill) => (
                  <Badge
                    key={skill}
                    variant={
                      selectedSkills.includes(skill) ? "default" : "secondary"
                    }
                    className="cursor-pointer"
                    onClick={() => handleSkillSelect(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-white/5 p-4 flex items-center gap-2 lg:hidden backdrop-blur-lg border-none shadow-2xl text-white">
        <Input type="text" placeholder="Search Developers..." />
        <div className="flex gap-2">
          <SearchIcon className="w-8 h-8 text-white bg-gray-800 p-2 rounded-lg" />
          <MobileSearchAndFilterDialog
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
          />
        </div>
      </Card>
    </>
  );
};

export default ExplorePageSearchFilters;

type MobileSearchAndFilterDialogProps = {
  experienceLevel: number[];
  setExperienceLevel: React.Dispatch<React.SetStateAction<number[]>>;
};
const MobileSearchAndFilterDialog = ({
  experienceLevel,
  setExperienceLevel,
}: MobileSearchAndFilterDialogProps) => {
  const {
    location,
    handleLocationChange,
    suggestions,
    setSelectedSuggestion,
    selectedSuggestion,
    location_loading,
    setLocation,
  } = useSearchFilters();

  const {
    skill,
    skillSuggestions,
    handleSelectSkill,
    handleSkillChange,
    selectedSkill,
    skillSuggestionLoading,
  } = useSuggestSkills();

  const { topSkillsArray, loading, error } = useGetTopSkills();

  // console.log(selectedSkill)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <FilterIcon className="w-8 h-8 text-white bg-gray-800 p-2 rounded-lg" />
      </DialogTrigger>
      <form>
        <DialogContent className="bg-white/5 backdrop-blur-xl border-none p-3 w-[90%] absolute top-[20rem] rounded-lg">
          <DialogHeader>
            <DialogTitle className="tracking-wider text-3xl gradient-text">
              Filters
            </DialogTitle>
            <DialogDescription className="text-gray-400 tracking-wider">
              Filter developers by skills, experience, and location
            </DialogDescription>
          </DialogHeader>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="Skills">
              <AccordionTrigger className="hover:no-underline text-white text-xl">
                Skills
              </AccordionTrigger>
              <AccordionContent>
                <Input
                  type="text"
                  placeholder="Find Skills..."
                  className="text-white"
                  value={skill}
                  onChange={(e) => handleSkillChange(e.target.value)}
                />
                {skillSuggestionLoading && (
                  <div className="h-[12rem] flex justify-center items-center">
                    <Loader className="text-white" />
                  </div>
                )}
                {skillSuggestions?.length > 0 && !selectedSkill && (
                  <ul className="mt-1 max-h-60 overflow-auto rounded-md bg-gray-800 py-1 text-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-md">
                    {skillSuggestions.map((suggestion: any, index: number) => (
                      <li
                        key={index}
                        className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-300 hover:bg-gray-700 capitalize"
                        onClick={() => {
                          handleSelectSkill(suggestion);
                        }}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <span className="text-lg text-white">Top Skills</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {topSkillsArray?.length > 0 &&
                      !loading &&
                      topSkillsArray.map(({ id, name }) => (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer capitalize"
                        >
                          {name}
                        </Badge>
                      ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Experience">
              <AccordionTrigger className="hover:no-underline text-white text-xl">
                Experience
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-white">
                  <Label className="mt-3 text-lg text-white">
                    Experience Level
                  </Label>
                  <Slider
                    defaultValue={[0]}
                    max={50}
                    step={1}
                    value={experienceLevel}
                    className="rounded-full border-none ouline-none mt-3"
                    onValueChange={(vals) => {
                      setExperienceLevel((prev) => [vals[0], prev[1]]);
                    }}
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span>{experienceLevel[0]} years</span>
                    <span>{experienceLevel[1]} years</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Location">
              <AccordionTrigger className="text-white hover:no-underline text-xl">
                Location
              </AccordionTrigger>
              <AccordionContent>
                <Input
                  type="text"
                  value={location}
                  placeholder="Find Location..."
                  className="text-white"
                  onChange={(e) => handleLocationChange(e.target.value)}
                />
                {suggestions?.length > 0 && !selectedSuggestion && (
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
                          setLocation(fullLocation);
                        }}
                      >
                        {suggestion.city},{" "}
                        {suggestion.state && `${suggestion.state}, `}
                        {suggestion.country}
                      </li>
                    ))}
                  </ul>
                  // <div className="h-[12rem] bg-slate-600 rounded-md">
                  //   <div className="flex flex-wrap gap-2 mt-2">
                  //     {suggestions.map((suggestion: any, index: number) => (
                  //       <li
                  //         key={index}
                  //         className="cursor-pointer select-none py-2 pl-3 pr-9 text-gray-300 hover:bg-gray-700"
                  //         onClick={() => setSelectedSuggestion(suggestion)}
                  //       >
                  //         {suggestion?.city}, {suggestion?.state},{" "}
                  //         {suggestion?.country}
                  //       </li>
                  //     ))}
                  //   </div>
                  // </div>
                )}
                {location_loading && (
                  <div className="h-[12rem] flex justify-center items-center">
                    <Loader className="text-white" />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="mt-4 bg-gray-900 hover:bg-gray-800"
                type="submit"
              >
                Apply
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
