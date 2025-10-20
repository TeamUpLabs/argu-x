import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, TrendingDown, Info, Coins, Users, Activity, CheckCircle, PenTool, ArrowRight } from "lucide-react";

interface InsightData {
  id: number;
  author: string;
  title: string;
  opinion: string;
  currentVotes: number;
  totalStaked: number;
  supportRatio: number;
  challengeRatio: number;
}

interface ParticipationOrderProps {
  selectedInsight?: InsightData;
}

export default function ParticipationOrder({ selectedInsight }: ParticipationOrderProps) {
  const [mode, setMode] = useState<'vote' | 'create'>('vote');
  const [tokenAmount, setTokenAmount] = useState<number>(10);
  const [newInsightText, setNewInsightText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const insight: InsightData | null = selectedInsight || null;

  const tokenOptions = [5, 10, 25, 50, 100];

  const handleTokenSelect = (amount: number) => {
    setTokenAmount(amount);
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (mode === 'vote') {
      console.log(`${insight?.opinion} 투표를 위해 ${tokenAmount} ARGX 토큰을 스테이킹합니다. 인사이트: ${insight?.title}`);
    } else {
      console.log(`새 인사이트 작성: ${newInsightText} (토큰: ${tokenAmount} ARGX)`);
    }
    setShowConfirm(false);
    setOrderPlaced(true);

    setTimeout(() => {
      setOrderPlaced(false);
      setTokenAmount(10);
      if (mode === 'create') {
        setNewInsightText('');
      }
    }, 3000);
  };

  return (
    <div className="space-y-8 pt-6">
      {/* Main Content Card */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-normal text-gray-900">참여 방법 선택</CardTitle>
          <CardDescription className="text-gray-600">
            원하는 참여 방식을 선택하고 토큰을 스테이킹하세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Mode Selection - Clean Toggle */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('vote')}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${mode === 'vote'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'vote' ? 'bg-gray-900' : 'bg-gray-200'
                    }`}>
                    <TrendingUp className={`h-4 w-4 ${mode === 'vote' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${mode === 'vote' ? 'text-gray-900' : 'text-gray-600'}`}>
                      기존 인사이트 투표
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode('create')}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${mode === 'create'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'create' ? 'bg-gray-900' : 'bg-gray-200'
                    }`}>
                    <PenTool className={`h-4 w-4 ${mode === 'create' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${mode === 'create' ? 'text-gray-900' : 'text-gray-600'}`}>
                      새 인사이트 작성
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Content based on mode */}
          {mode === 'vote' && insight?.title && (
            <div className="space-y-6">
              {/* Insight Information - Clean Layout */}
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{insight.title}</h3>
                    <span className="text-sm text-gray-600">작성자: {insight.author}</span>
                  </div>

                  {/* Stats in a clean row */}
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="text-xl font-semibold text-gray-900">{insight.currentVotes.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">참여자</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Coins className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="text-xl font-semibold text-gray-900">{insight.totalStaked.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">ARGX 스테이킹</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Activity className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        <span className="text-gray-700">{insight.supportRatio}%</span>
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="text-gray-700">{insight.challengeRatio}%</span>
                      </div>
                      <div className="text-xs text-gray-500">찬성 • 반대</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote Type Selection - Simple Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">입장</Label>
                <div className="flex">
                  {insight.opinion === 'pros' ? (
                    <button
                      className={`flex-1 p-4 rounded-lg border-2 text-center transition-all duration-200 ${insight.opinion === 'pros'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <TrendingUp className={`h-5 w-5 mx-auto mb-2 ${insight.opinion === 'pros' ? 'text-gray-900' : 'text-gray-500'
                        }`} />
                      <div className={`font-medium ${insight.opinion === 'pros' ? 'text-gray-900' : 'text-gray-600'}`}>
                        찬성
                      </div>
                    </button>
                  ) : (
                    <button
                      className={`flex-1 p-4 rounded-lg border-2 text-center transition-all duration-200 ${insight.opinion === 'cons'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <TrendingDown className={`h-5 w-5 mx-auto mb-2 ${insight.opinion === 'cons' ? 'text-gray-900' : 'text-gray-500'
                        }`} />
                      <div className={`font-medium ${insight.opinion === 'cons' ? 'text-gray-900' : 'text-gray-600'}`}>
                        반대
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Create Mode */}
          {mode === 'create' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">새 인사이트 작성</Label>
                <Textarea
                  placeholder="이 토론에 대한 당신의 생각과 관점을 자유롭게 작성해주세요..."
                  value={newInsightText}
                  onChange={(e) => setNewInsightText(e.target.value)}
                  className="min-h-[120px] resize-none border-gray-300 focus:border-gray-900 focus:ring-0"
                />
                <div className="text-xs text-gray-500 text-right">
                  {newInsightText.length}/500자
                </div>
              </div>
            </div>
          )}

          {/* Token Selection - Minimal Design */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">토큰 스테이킹</Label>
              <div className="flex items-center text-xs text-gray-500">
                <Info className="h-3 w-3 mr-1" />
                스테이킹 양에 따라 영향력 결정
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {tokenOptions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleTokenSelect(amount)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${tokenAmount === amount
                    ? 'border-gray-900 bg-gray-50 text-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                  {amount}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <span>예상 영향력 포인트:</span>
              <span className="font-semibold text-gray-900">+{Math.floor(tokenAmount * 0.1)}</span>
            </div>
          </div>

          {/* Action Button - Clean and Prominent */}
          <button
            onClick={handleSubmit}
            disabled={(mode === 'create' && !newInsightText.trim()) || (mode === 'vote' && !insight)}
            className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>
              {mode === 'vote' ? (
                `${tokenAmount} ARGX로 ${insight?.opinion === 'pros' ? '찬성하기' : '반대하기'}`
              ) : (
                `${tokenAmount} ARGX로 인사이트 작성하기`
              )}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Confirmation Modal - Minimal Design */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-gray-600" />
            </div>
            <DialogTitle className="text-xl font-normal text-gray-900">
              참여 확인
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              선택한 내용이 맞는지 확인해주세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              {mode === 'vote' ? (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">인사이트:</span>
                    <span className="text-sm text-gray-900 max-w-[200px] break-words text-right">
                      {insight?.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">입장:</span>
                    <Badge variant={insight?.opinion === 'pros' ? 'default' : 'destructive'}>
                      {insight?.opinion === 'pros' ? '찬성' : '반대'}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">내용:</span>
                  <span className="text-sm text-gray-900 max-w-[200px] break-words text-right">
                    {newInsightText}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">스테이킹 토큰:</span>
                <span className="text-base font-semibold text-gray-900">{tokenAmount} ARGX</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={confirmAction}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success State - Clean and Simple */}
      <Dialog open={orderPlaced} onOpenChange={setOrderPlaced}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="sr-only">
              {mode === 'vote' ? '투표 완료' : '인사이트 작성 완료'}
            </DialogTitle>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </DialogHeader>

          <div className="text-center space-y-4">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {mode === 'vote' ? '투표 완료' : '인사이트 작성 완료'}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {mode === 'vote'
                  ? `성공적으로 ${tokenAmount} ARGX 토큰을 스테이킹하여 이 인사이트를 ${insight?.opinion === 'pros' ? '찬성' : '반대'}했습니다.`
                  : `새 인사이트가 성공적으로 작성되었으며 ${tokenAmount} ARGX 토큰이 스테이킹되었습니다.`
                }
              </p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              +{Math.floor(tokenAmount * 0.1)} 영향력 포인트 획득
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}