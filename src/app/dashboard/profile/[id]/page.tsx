import { Button } from "@/components/ui/button";
import { signOut } from "@/features/actions/auth/signout";
import { getUserById } from "@/features/actions/profile/actions";
import { validateServerProtectedRoute } from "@/lib/validate-server-protected-route";

export default async function Profile() {
  const { user } = await validateServerProtectedRoute();
  const { data } = await getUserById(user.id);
  return (
    <div>
      <b>Dashboard</b>
      <p>{JSON.stringify(data, null, 2)}</p>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import { signOut } from "@/features/actions/auth/signout";
// import React from "react";
// import { ValidateClientProtectedRoute } from "@/lib/validate-client-protected-route";

// export default function Dashboard() {
//   const {user} = ValidateClientProtectedRoute()
//   return (
//     <div>
//       <b>Dashboard</b>
//       <p>Hi, this is client page</p>
//       <p>{JSON.stringify(user, null, 2)}</p>
//       <Button type="submit" onClick={() => signOut()}>
//         Sign out
//       </Button>
//     </div>
//   );
// }
