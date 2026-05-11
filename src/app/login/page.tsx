import { LoginForm } from "./ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const next =
    typeof sp.next === "string" && sp.next.length > 0 ? sp.next : "/dashboard";
  const signedOut = sp.signed_out === "1";

  return <LoginForm nextPath={next} signedOut={signedOut} />;
}

