"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const handleEdit = async () => {
    if (type === "Question") {
      router.push(`/questions/${itemId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      toast("Question deleted");
    } else if (type === "Answer") {
      toast("answer deleted");
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={16}
          height={16}
          className="cursor-pointer hover:opacity-80"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src="/icons/trash.svg" alt="trash" height={15} width={15} />
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "Question" ? "question" : "answer"}
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="! bg-gradient-to-r from-orange-400 to-orange-300 "
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
