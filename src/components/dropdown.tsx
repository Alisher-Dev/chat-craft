import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { removeToken } from "@/lib/tokens";
import { urls } from "@/lib/urls";
import { useAuthStor } from "@/stor/auth";

export function DropdownMenuRadioGroupDemo({ name }: { name: string | undefined }) {
  const updateAccessToken = useAuthStor((state) => state.updateAccessToken);
  const updateRefreshToken = useAuthStor((state) => state.updateRefreshToken);

  const handelLogout = async () => {
    try {
      await api.post(`${urls.auth.logout}`);
      removeToken();
      updateAccessToken("");
      updateRefreshToken("");
    } catch (error: unknown) {
      console.log(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-white font-bold text-md border-2 border-white">
          {name || "user"}
          <span className="rotate-90 px-1 py-2">{">"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-0">
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem
            onClick={() => handelLogout()}
            value=""
            className="bg-red-600 focus:bg-red-500 focus:text-gray-50 cursor-pointer text-white"
          >
            logout
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
