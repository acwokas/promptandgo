import { useUserXP } from "@/hooks/useUserXP";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, Gift, Calendar, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import SEO from "@/components/SEO";

export default function XPDashboard() {
  const { userXP, activities, transactions, rewards, isLoadingXP, redeemReward, isRedeeming } = useUserXP();

  if (isLoadingXP) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!userXP) {
    return <div className="container mx-auto p-6">No XP data available</div>;
  }

  const xpToNextLevel = (userXP.level * 100) - userXP.total_xp;
  const progressToNextLevel = ((userXP.total_xp % 100) / 100) * 100;

  const earnTransactions = transactions?.filter(t => t.transaction_type === 'earn') || [];
  const spendTransactions = transactions?.filter(t => t.transaction_type === 'spend') || [];

  return (
    <>
      <SEO 
        title="XP Dashboard - PromptAndGo"
        description="Track your XP progress, complete activities, and redeem rewards"
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">XP Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and redeem rewards
            </p>
          </div>
        </div>

        {/* XP Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userXP.total_xp.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available XP</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userXP.available_xp.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to spend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {userXP.level}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {xpToNextLevel} XP to next level
              </p>
              <Progress value={progressToNextLevel} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Activities & Transactions */}
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Activities</CardTitle>
                <CardDescription>
                  Complete these activities to earn XP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities?.map((activity) => {
                    const isCompleted = earnTransactions?.some(
                      t => t.activity_key === activity.activity_key
                    );

                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium">{activity.activity_name}</p>
                            {activity.activity_description && (
                              <p className="text-sm text-muted-foreground">
                                {activity.activity_description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            +{activity.xp_value} XP
                          </Badge>
                          {activity.is_repeatable && (
                            <Badge variant="outline" className="text-xs">
                              {activity.repeat_interval || 'Repeatable'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Your recent XP activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions?.slice(0, 20).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description || 'XP Transaction'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <Badge
                        variant={transaction.transaction_type === 'earn' ? 'default' : 'secondary'}
                      >
                        {transaction.transaction_type === 'earn' ? '+' : '-'}
                        {transaction.xp_amount} XP
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rewards Store</CardTitle>
                <CardDescription>
                  Redeem your XP for exclusive rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!rewards || rewards.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No rewards available at the moment. Check back soon!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewards.map((reward) => {
                      const canAfford = userXP.available_xp >= reward.xp_cost;
                      
                      return (
                        <div
                          key={reward.id}
                          className={`p-4 border rounded-lg ${
                            canAfford ? 'border-primary/20 bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {reward.icon && (
                                <span className="text-2xl">{reward.icon}</span>
                              )}
                              <div>
                                <h3 className="font-semibold">{reward.reward_name}</h3>
                                <Badge variant={canAfford ? "default" : "secondary"} className="mt-1">
                                  {reward.xp_cost.toLocaleString()} XP
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {reward.reward_description && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {reward.reward_description}
                            </p>
                          )}
                          
                          <Button
                            onClick={() => redeemReward(reward.id)}
                            disabled={!canAfford || isRedeeming}
                            className="w-full"
                            variant={canAfford ? "default" : "outline"}
                          >
                            {isRedeeming ? 'Redeeming...' : canAfford ? 'Redeem' : 'Insufficient XP'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
