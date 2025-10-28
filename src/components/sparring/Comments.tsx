import { Debate } from "@/types/Debate";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Send, Trash } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useSparringContext } from "@/provider/SparringProvider";
import { useUserStore } from "@/store/userStore";
import { getRelativeDate } from "@/lib/getRelativeDate";

interface CommentsProps {
  debate?: Debate;
}

export default function Comments({ debate }: CommentsProps) {
  const [comment, setComment] = useState('');
  const { addComment, deleteComment, isAddingComment, isDeletingComment } = useSparringContext();
  const { user } = useUserStore();

  const handleSubmit = async () => {
    if (comment.trim() === '' || !debate) return;

    try {
      await addComment(comment);
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <InputGroup>
        <InputGroupInput
          placeholder={debate ? "Write a comment..." : "Loading debate..."}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!debate}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="outline" onClick={handleSubmit} disabled={!debate || isAddingComment}>
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {!debate || !debate.comments || debate.comments.length === 0 ? (
        <p className="text-muted-foreground text-center">No comments.</p>
      ) : (
        debate.comments
          .toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((comment) => (
            <div key={comment.id} className="flex items-start p-2">
              <div className="bg-muted w-12 h-12 rounded-full">
                {comment.creator.avatar && (
                  <Image
                    src={comment.creator.avatar}
                    alt={comment.creator.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">{comment.creator.name}</span>
                    <span className="text-muted-foreground text-xs">{getRelativeDate(comment.created_at)}</span>
                  </div>
                  {comment.creator.id === user?.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={isDeletingComment}
                      className="cursor-pointer hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
                <p className="text-foreground">{comment.content}</p>
              </div>
            </div>
          ))
      )}
    </div>
  );
}