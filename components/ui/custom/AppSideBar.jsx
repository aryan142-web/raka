import React from 'react'
import Image from "next/image"   // 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from '../button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistroy from './WorkspaceHistroy'
import SideBarFooter from './SideBarFooter'
function AppSideBar() {
  return (
     <Sidebar>
      <SidebarHeader className="p-5" >
       {/* // <Image src={'/logo.png'} alt='logo' width={30} height={30}/> */}
          <Button className="mt-5"> <MessageCircleCode/>start New Chat </Button>
        </SidebarHeader>
      <SidebarContent className="p-5">
      
        <SidebarGroup>
            <WorkspaceHistroy/>
            </SidebarGroup>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter/>
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSideBar
