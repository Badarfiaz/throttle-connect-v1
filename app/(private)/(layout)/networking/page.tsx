'use client'
import CategorySection from "@/components/shared/CategorySection"
import FeaturedSection from "@/components/shared/FeaturedSection"
import RegistureClubBanner from "@/components/shared/RegistureClubBanner"

 
function home() {
  return (
    <div>
        <CategorySection/>
      <FeaturedSection/>
      <RegistureClubBanner/>
    </div>

  )
}

export default home
