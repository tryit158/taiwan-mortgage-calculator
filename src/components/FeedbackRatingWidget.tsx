import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageSquare, Heart } from 'lucide-react';

interface FeedbackRatingWidgetProps {
  pageId: string;
  pageTitle: string;
}

export function FeedbackRatingWidget({ pageId, pageTitle }: FeedbackRatingWidgetProps) {
  const storageKey = `user_feedback_${pageId}`;
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);
  const [likesCount, setLikesCount] = useState<number>(142);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'yes' || saved === 'no') {
      setVoted(saved);
    }
    // Deterministic like count based on pageId length
    const baseLikes = 120 + ((pageId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 85));
    setLikesCount(baseLikes);
  }, [pageId, storageKey]);

  const handleVote = (choice: 'yes' | 'no') => {
    if (voted) return;
    setVoted(choice);
    localStorage.setItem(storageKey, choice);
    if (choice === 'yes') {
      setLikesCount(prev => prev + 1);
    } else {
      setShowCommentBox(true);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittedComment(true);
    setTimeout(() => {
      setShowCommentBox(false);
    }, 2000);
  };

  return (
    <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            這篇房貸指南與試算對您有幫助嗎？
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            已有 <strong className="text-slate-800">{likesCount} 位</strong> 讀者認為內容客觀精確且有實質參考價值
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleVote('yes')}
            disabled={voted !== null}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              voted === 'yes'
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>非常有幫助 {voted === 'yes' && '(已感謝)'}</span>
          </button>

          <button
            onClick={() => handleVote('no')}
            disabled={voted !== null}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              voted === 'no'
                ? 'bg-amber-600 text-white cursor-default'
                : 'bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 hover:border-amber-300'
            }`}
          >
            <ThumbsDown className="w-4 h-4 text-amber-600" />
            <span>需要補充</span>
          </button>
        </div>
      </div>

      {voted === 'yes' && (
        <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-emerald-700 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          感謝您的正面鼓勵！智庫團隊將持續追蹤台灣各大銀行法規與利率更新。
        </div>
      )}

      {showCommentBox && (
        <form onSubmit={handleSendComment} className="mt-4 pt-4 border-t border-slate-200/80 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            請告訴我們哪些地方可以寫得更好或更深入？（例如：需要哪家銀行的內規說明）
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="您的建議..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              送出回饋
            </button>
          </div>
          {submittedComment && (
            <p className="text-xs text-indigo-600 font-medium">已收到您的建議，編審團隊會在下次更新時補充！</p>
          )}
        </form>
      )}
    </div>
  );
}
