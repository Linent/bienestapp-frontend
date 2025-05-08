import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import AdvisoryCalendar from "@/components/schedule/AdvisoryCalendar";
import { Divider } from "@heroui/react";

export default function SchedulePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // Redirige automáticamente
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return null; // No renderiza la página mientras redirige
  }

  return (
    <DefaultLayout>
      <div className=" flex flex-col w-full items-center p-6">
        <h1 className={title()}>Calendario</h1>
        <Divider className="my-4"/>
        <AdvisoryCalendar />
      </div>
    </DefaultLayout>
  );
}
