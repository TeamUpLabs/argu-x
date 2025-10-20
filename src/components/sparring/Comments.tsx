import { Comment } from "@/types/Debate";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Send } from "lucide-react";

interface CommentsProps {
  comments: Comment[];
}

export default function Comments({ comments }: CommentsProps) {
  return (
    <div className="flex flex-col gap-2">
      <InputGroup>
        <InputGroupInput placeholder="Write a comment..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="outline">
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-center">No comments.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex items-start p-2">
            <div className="bg-muted w-12 h-12 rounded-full">

            </div>
            <div className="flex flex-col gap-1 ml-4">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{comment.creator.name}</span>
                <span className="text-muted-foreground text-xs">{comment.created_at}</span>
              </div>
              <p className="text-foreground">{comment.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}