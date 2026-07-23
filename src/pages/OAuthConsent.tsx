import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import MusicNotes from "@/components/MusicNotes";
import { Loader2, Music } from "lucide-react";

// Narrow local typing for the beta supabase.auth.oauth API.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-foreground flex items-center justify-center">
      <MusicNotes />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold mt-3">Authorize access</h1>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          {error ? (
            <p className="text-destructive text-sm">Could not load this request: {error}</p>
          ) : !details ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <h2 className="text-lg font-serif font-bold mb-2">
                Connect {details.client?.name ?? "an app"} to your account
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                This lets {details.client?.name ?? "the client"} read and manage your Lyrical Tale
                Weaver storybooks as you.
              </p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/80"
                  disabled={busy}
                  onClick={() => decide(true)}
                >
                  {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  disabled={busy}
                  onClick={() => decide(false)}
                >
                  Deny
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthConsent;
