"use client"

import { Button } from "@/components/ui/button"
import { AudioWaveform, Bell, LogIn, LogOut, Menu, Settings, User, UserPlus, Users } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SignOutButton, SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from "@clerk/clerk-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import ContactsDrawer from "./ContactsDrawer"
import AddContactTrigger from "./AddContactTrigger"

const Navbar = () => {

    const { user } = useUser()
    const router = useRouter()

  return (
    <nav className="p-4 w-full flex justify-between items-center z-10 fixed top-0 border-b-[1px] border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0c0a09]">
        <ContactsDrawer>
            <Users className="sm:hidden" />
        </ContactsDrawer>

        <div className="flex gap-3 items-center">
            <h3 className="md:text-3xl hover:cursor-pointer font-bold text-2xl" onClick={() => router.push('/')}>Whisper-wave</h3>
            <AudioWaveform size={24} />
        </div>

        {/* MOBILE NAVIGATION - [RIGHT SHEET] */}
        <Sheet>
            <SheetTrigger className="sm:hidden">
                <Menu />
            </SheetTrigger>
            <SheetContent>
                <SheetTitle>
                    <span className="font-bold text-2xl">
                        Whisper-wave.
                    </span>
                </SheetTitle>
                <div className="my-6 flex flex-col justify-center gap-3">
                    <ModeToggle className="w-full" />
                    <SignedOut>
                        <SignInButton>
                            <SheetClose asChild>
                                <Button variant="outline">Sign In <LogIn size={18} className="mx-1" /></Button>
                            </SheetClose>
                        </SignInButton>

                        <SignUpButton>
                            <SheetClose asChild>
                                <Button variant="outline">Sign up <User size={18} className="mx-1" /></Button>
                            </SheetClose>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <AddContactTrigger>
                            <Button variant='outline'><UserPlus size={18} className="mx-2" /> Add Contact</Button>
                        </AddContactTrigger>
                        <SheetClose asChild>
                            <Button variant='outline' onClick={() => router.push('/profile')}>{user?.fullName} <User size={18} className="mx-1" /></Button>
                        </SheetClose>
                        <SignOutButton>
                            <SheetClose asChild>
                                <Button variant='outline'>Log Out<LogOut size={18} className="mx-1" /></Button>
                            </SheetClose>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </SheetContent>
        </Sheet>

        {/* DESKTOP NAVIGATION */}
        <div className="sm:flex gap-2 hidden"> 
            <SignedOut>
                <ModeToggle />
                <SignInButton>
                    <Button variant='outline'>Sign In <LogIn size={18} className="mx-1" /></Button>
                </SignInButton>
                <SignUpButton>
                    <Button variant='outline'>Sign Up <User size={18} className="mx-1" /></Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <ModeToggle />
                <Button variant="outline"><Bell size={18} /></Button>
                <AddContactTrigger>
                    <Button variant='outline'><UserPlus size={18} className="mx-2" /> Add Contact</Button>
                </AddContactTrigger>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline'>
                            {user?.fullName} <User size={18} className="mx-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <SignOutButton>
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log Out</span>
                            </DropdownMenuItem>
                        </SignOutButton>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SignedIn>
        </div>
    </nav>
  )
}

export default Navbar