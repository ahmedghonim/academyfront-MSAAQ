import { LoadingScreen } from "@/components/loading-screen";
import { EditEmailInput, EditPasswordInput, EditPhoneInput } from "@/components/profile/inputs";
import { useSession } from "@/providers/session-provider";

const LoginData = () => {
  const { member } = useSession();

  return !member ? (
    <LoadingScreen />
  ) : (
    <>
      <EditPhoneInput />
      <EditEmailInput />
      <EditPasswordInput />
    </>
  );
};

export default LoginData;
