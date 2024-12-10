"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, UserIcon, PhoneIcon, MailIcon, MapPin } from "lucide-react";
import { countPeopleByLocation } from "@/lib/address";

// Mock data for team members
const initialTeamMembers = [
  {
    id: 1,
    name: "Deepak Raj Giri",
    role: "Manager",
    email: "deepak@applyworldgroup.com.au",
    phone: "+61 424 141 221",
    address: "Level 5 Suite 55 104 Bathrust street, Sydney 2000 NSW ",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Administration",
  },
  {
    id: 2,
    name: "Anish Dahal",
    role: "Education Consultant",
    email: "anish@applyworldgroup.com.au",
    phone: "+61 410 885 255",
    address: "Level 5 Suite 55 104 Bathrust street, Sydney 2000 NSW ",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Consulting",
  },
  {
    id: 3,
    name: "Aman Basnet",
    role: "Marketing Representative",
    email: "aman@applyworldgroup.com.au",
    phone: "+61 433 453 351",
    address: "Level 5 Suite 55 104 Bathrust street, Sydney 2000 NSW ",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Marketing",
  },
  {
    id: 4,
    name: "Amrit Niure",
    role: "IT Support",
    email: "amrit@applyworldgroup.com.au",
    phone: "+61 424 562 124",
    address: "Level 5 Suite 55 104 Bathrust street, Sydney 2000 NSW ",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "IT",
  },
  {
    id: 5,
    name: "Kishan Joshi",
    role: " Counsellor ",
    email: "kishan@applyworldgroup.com.au",
    phone: "+61 433 453 351",
    address: "Level 5 Suite 55 104 Bathrust street, Sydney 2000 NSW ",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Counsulting",
  },
  {
    id: 6,
    name: "Akemi Lansangan Koketsu",
    role: "Receptionist",
    email: "akemi@applyworldgroup.com.au",
    phone: "+61 431 885 769",
    address: "Level 5 Suite 55 104 Bathrust street, Sydney 2000 NSW ",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Front Desk",
  },
  {
    id: 7,
    name: "Pooja Amatya",
    role: "Administrative Officer (407 Training visa)",
    email: "pooja@applyworldgroup.com.au",
    phone: "+977 9841248188",
    address: "Kathmandu, Nepal",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Visa",
  },
  {
    id: 8,
    name: "Seema Shakya",
    role: "Administrative officer (482/186) Work Visa ",
    email: "seema@applyworldgroup.com.au",
    phone: "+977 9849127724",
    address: "Kathmandu, Nepal",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Visa",
  },
  {
    id: 9,
    name: "Junu Kafle",
    role: "Case officer",
    email: "junu@applyworldgroup.com.au",
    phone: "+977 9861950304",
    address: "Kathmandu, Nepal",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Visa",
  },
  {
    id: 10,
    name: "Sandhya Koirala",
    role: "Administrative Representative - Skills Assessment",
    email: "sandhya@applyworldgroup.com.au",
    phone: "+977 9860673165",
    address: "Kathmandu, Nepal",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Visa",
  },
  {
    id: 11,
    name: "Dinesh Pun",
    role: "Administrative Representative - Dubai",
    email: "dinesh@applyworldgroup.com.au",
    phone: "+971 56 716 2901",
    address: "Office No. M06, Bank Street Building, Al Makhool, Bur Dubai",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Visa",
  },
  {
    id: 12,
    name: "Leslie Anne Mahusay",
    role: "Administrative Representative - Philippines",
    email: "leslie@applyworldgroup.com.au",
    phone: "+63 977 737 9503",
    address: "Philiphines",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Visa",
  },
];

const locationCount = countPeopleByLocation(initialTeamMembers);

export default function TeamPage() {
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setNewMember({ ...newMember, role: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      <CardHeader className="space-y-1 px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Our Team</CardTitle>
        </div>
        <CardDescription>
          Contact information of our team members
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Team Members
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationCount.Australia}</div>
            <p className="text-xs text-muted-foreground">Sydney, Australia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Team Members
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationCount.Nepal}</div>
            <p className="text-xs text-muted-foreground">Kathmandu, Nepal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Team Members
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationCount.Dubai}</div>
            <p className="text-xs text-muted-foreground">Dubai</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Team Members</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Enter the details of the new team member here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales Manager">
                        Sales Manager
                      </SelectItem>
                      <SelectItem value="Marketing Specialist">
                        Marketing Specialist
                      </SelectItem>
                      <SelectItem value="Customer Support">
                        Customer Support
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={newMember.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialTeamMembers.map((member) => (
          <Card key={member.id} className="transition-all duration-300 ">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {member.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {member.phone}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {member.address}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
