import { useContext } from "react";
import { ThemeCtx } from "@/components/site/theme-provider";

export const useTheme = () => useContext(ThemeCtx);
