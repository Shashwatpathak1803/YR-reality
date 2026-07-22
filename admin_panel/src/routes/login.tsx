import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Loader2 } from "lucide-react";
import { login } from "@/services/auth";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Welcome to YR Realty" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password, !!data.remember);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left — form */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2.5 mb-10">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-xl font-semibold leading-none">YR Realty</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Admin Console</div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage listings, enquiries and site visits.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                     to="/forgot-password" 
                     className="text-xs text-primary hover:underline"
                     >
                      Forgot password?
                     </Link>
              </div>
              <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox
                checked={!!watch("remember")}
                onCheckedChange={(v) => setValue("remember", !!v)}
              />
              Remember me for 30 days
            </label>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in</> : "Sign in"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secured with JWT · Role-based access
            </p>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            © {new Date().getFullYear()} YR Realty Estate. <Link to="/dashboard" className="hover:underline">Preview dashboard</Link>
          </p>
        </motion.div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden lg:block relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/70 to-primary/30" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
            <span className="h-px w-8 bg-gold" /> Premium Real Estate
          </div>
          <div>
            <h2 className="font-display text-5xl font-semibold leading-tight max-w-md">
              Sell villas, plots & flats — all from one refined console.
            </h2>
            <p className="mt-4 max-w-md opacity-85">
              Manage listings, capture enquiries, schedule visits and close deals with a workflow built for modern brokerages.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "218", v: "Active listings" },
                { k: "1.2k", v: "Monthly enquiries" },
                { k: "94%", v: "Client retention" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl text-gold">{s.k}</div>
                  <div className="text-xs opacity-75 mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
