"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Edit, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useSkillCreate, useUpdateSkill } from "@/hooks";
import { MAX_DESCRIPTION, skillSchema } from "@/validation";
import { ISkills } from "@/types/skills.types";
import { ICategory } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ISelectOption {
  value: string;
  label: string;
}

type Props = {
  skill?: ISkills;
  mode?: "edit" | "create";
  categories?: ICategory[];
};

export function SkillModal({ skill, mode = "create", categories }: Props) {
  const isEdit = mode === "edit" && !!skill;
  const [open, setOpen] = useState(false);

  const { mutate: createSkill, isPending: createPending } = useSkillCreate();
  const { mutate: updateSkill, isPending: updatePending } = useUpdateSkill();

  const isPending = isEdit ? updatePending : createPending;

  const categoryOptions: ISelectOption[] = categories
    ? categories.map((category: ICategory) => ({
        value: category.id,
        label: category.name,
      }))
    : [];

  console.log("select options", categoryOptions);

  const getDefaults = () => ({
    name: skill?.name ?? "",
    description: skill?.description ?? "",
    categoryId: skill?.categoryId ?? "",
    icon: skill?.icon ?? "",
  });

  const form = useForm({
    defaultValues: getDefaults(),
    validators: {
      onChange: skillSchema,
    },
    onSubmit: ({ value }) => {
      const data = {
        name: value.name.trim(),
        description: value.description.trim(),
        categoryId: value.categoryId.trim(),
        icon: value.icon.trim(),
      };

      const callbacks = {
        onSuccess: (res: { message: string }) => {
          toast.success(res.message);
          setOpen(false);
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      };

      if (isEdit) {
        updateSkill({ payload: data, id: skill.id }, callbacks);
      } else {
        createSkill(data, callbacks);
      }
    },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) form.reset(getDefaults());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline" aria-label="Edit region">
            <Edit className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Create Skill
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Skill" : "Create Skill"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit the details of this skill."
              : "Add a new skill to your marketplace."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Skill Name<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="e.g. Electrician"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-2 gap-2">
              <form.Field name="categoryId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="categoryId">
                          Category<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger onBlur={field.handleBlur}>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option: ISelectOption) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="icon">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category Icon</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="off"
                      placeholder="e.g. wrench"
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="Briefly describe this region..."
                    />
                    <div className="flex items-start justify-between gap-2">
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {field.state.value.length}/{MAX_DESCRIPTION}
                      </span>
                    </div>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="flex-row justify-end gap-2 sm:justify-end sm:gap-2">
            <DialogClose asChild>
              <Button
                size={"sm"}
                type="button"
                variant="outline"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe selector={(s) => s.canSubmit}>
              {(canSubmit) => (
                <Button
                  size={"sm"}
                  type="submit"
                  disabled={isPending || !canSubmit}
                >
                  {isPending ? (
                    <>
                      <Spinner /> {isEdit ? "Updating" : "Creating"}
                    </>
                  ) : isEdit ? (
                    "Update Skill"
                  ) : (
                    "Create Skill"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
