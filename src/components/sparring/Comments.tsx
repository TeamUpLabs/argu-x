import { Comment, Debate } from "@/types/Debate";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Send } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface CommentsProps {
  comments: Comment[];
  debate?: Debate;
}

export default function Comments({ comments, debate }: CommentsProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (comment.trim() === '' || !debate) return;

    try {
      const response = await fetch(`/api/debates/${debate.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: comment,
          debate_id: debate.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setComment('');
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
          <InputGroupButton variant="outline" onClick={handleSubmit} disabled={!debate}>
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