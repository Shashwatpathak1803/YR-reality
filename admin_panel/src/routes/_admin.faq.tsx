import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqService, type FaqInput } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Faq } from "@/types";

export const Route = createFileRoute("/_admin/faq")({ component: FaqPage });

function FaqDialog({
  trigger, initial, onSubmit, pending,
}: {
  trigger: React.ReactNode;
  initial?: Faq;
  onSubmit: (data: FaqInput, close: () => void) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setQuestion(initial?.question ?? "");
          setAnswer(initial?.answer ?? "");
          setCategory(initial?.category ?? "");
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. How do I book a site visit?" />
          </div>
          <div className="space-y-2">
            <Label>Answer</Label>
            <Textarea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write a clear, helpful answer" />
          </div>
          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Buying, Loans" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={pending || !question.trim() || !answer.trim()}
            onClick={() =>
              onSubmit(
                { question: question.trim(), answer: answer.trim(), category: category.trim() || undefined },
                () => setOpen(false),
              )
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving</> : (initial ? "Save Changes" : "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FaqPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["faqs"], queryFn: faqService.list });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["faqs"] });

  const createMutation = useMutation({
    mutationFn: faqService.create,
    onSuccess: () => { toast.success("FAQ added"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FaqInput }) => faqService.update(id, data),
    onSuccess: () => { toast.success("FAQ updated"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqService.remove(id),
    onSuccess: () => { toast.success("FAQ deleted"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequently Asked Questions"
        description="Manage FAQs shown across your website."
        breadcrumbs={[{ label: "FAQ" }]}
        actions={
          <FaqDialog
            trigger={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4" /> Add FAQ</Button>}
            pending={createMutation.isPending}
            onSubmit={(d, close) => createMutation.mutate(d, { onSuccess: close })}
          />
        }
      />
      <Card className="card-elevated">
        <CardContent className="p-4 md:p-6">
          {isLoading && <div className="text-sm text-muted-foreground py-8 text-center">Loading FAQs…</div>}
          {!isLoading && data.length === 0 && (
            <div className="text-sm text-muted-foreground py-8 text-center">No FAQs yet — add questions your buyers ask most.</div>
          )}
          <Accordion type="single" collapsible className="w-full">
            {data.map(f => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left">
                  <div>
                    <div className="text-sm font-medium">{f.question}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.category}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{f.answer}</p>
                  <div className="mt-3 flex gap-2">
                    <FaqDialog
                      trigger={<Button size="sm" variant="outline"><Pencil className="h-3 w-3" /> Edit</Button>}
                      initial={f}
                      pending={updateMutation.isPending}
                      onSubmit={(d, close) => updateMutation.mutate({ id: f.id, data: d }, { onSuccess: close })}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3 w-3" /> Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                          <AlertDialogDescription>"{f.question}" will be removed from the website.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(f.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
