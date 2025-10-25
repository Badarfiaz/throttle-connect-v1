import { categories } from "@/dummydata/networking";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Title from "../shared/Title";
import SharedButton from "../shared/SharedButton";

function RegistureFormClub() {
  return (
    <div className="max-w-2xl mt-10 mx-auto bg-background shadow-lg rounded-xl p-6 space-y-6">
      <Title title="Register Your Club" />

      {/* Banner Upload */}
      <div className="space-y-2">
        <Label htmlFor="banner">Banner</Label>
        <Input id="banner" type="file" accept="image/*" />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <Input id="logo" type="file" accept="image/*" />
      </div>

      {/* Club Name */}
      <div className="space-y-2">
        <Label htmlFor="clubName">Club Name</Label>
        <Input id="clubName" type="text" placeholder="Enter club name" />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select>
          <SelectTrigger id="category">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace("-", " ").toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" type="text" placeholder="Enter location" />
      </div>

      {/* Created By */}
      <div className="space-y-2">
        <Label htmlFor="createdBy">Created By</Label>
        <Input id="createdBy" type="text" placeholder="Enter creator name" />
      </div>

      {/* About the Club */}
      <div className="space-y-2">
        <Label htmlFor="about">About the Club</Label>
        <Textarea
          id="about"
          placeholder="Write a short description about your club..."
          className="min-h-[100px]"
        />
      </div>

      {/* Submit */}
      <SharedButton label="Register Club" />
    </div>
  );
}

export default RegistureFormClub;
