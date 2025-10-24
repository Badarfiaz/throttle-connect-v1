"use client";
import { useParams } from "next/navigation";

function ClubProfile() {
  const { id } = useParams();
  return <div>this is {id}</div>;
}

export default ClubProfile;
