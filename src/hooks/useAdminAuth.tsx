import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setIsEditor(false);
      setLoading(false);
      return;
    }

    const checkRoles = async () => {
      // Utiliser profiles au lieu de user_roles
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      console.log("Profile data:", data);
      console.log("Profile error:", error);

      const role = data?.role ?? "";
      setIsAdmin(role === "admin");
      setIsEditor(role === "editor");
      setLoading(false);
    };

    checkRoles();
  }, [user, authLoading]);

  return { user, isAdmin, isEditor, hasAccess: isAdmin || isEditor, loading };
}
