import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import DataService from "../services/DataService";

export default function IndexScreen() {
  const [isSetUp, setIsSetUp] = useState<boolean | null>(null);

  // Check whether onboarding has been completed
  useEffect(() => {
    DataService.isSetUp().then(setIsSetUp);
  }, []);

  // Redirect to Today or onboarding based on saved data
  if (isSetUp === null) return null;
  return <Redirect href={isSetUp ? "/today" : "/onboarding"} />;
}
