import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import DataService from "../services/DataService";

// App entry point. Redirecting to Welcome the first time, or straight to Today once
// onboarding is finished.
export default function IndexScreen() {
  const [isSetUp, setIsSetUp] = useState<boolean | null>(null);

  useEffect(() => {
    DataService.isSetUp().then(setIsSetUp);
  }, []);

  if (isSetUp === null) return null; // still checking storage
  return <Redirect href={isSetUp ? "/today" : "/onboarding"} />;
}
