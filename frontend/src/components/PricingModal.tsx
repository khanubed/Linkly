import React, { useContext, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Check, 
  Crown, 
  Zap, 
  BarChart3, 
  Shield, 
  Headphones,
  CreditCard,
  Lock,
  Sparkles
} from 'lucide-react';
import { PaymentContext } from '../context/PaymentContext';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLinksUsed: number;
}

interface PlanFeatures {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  buttonText: string;
  linksLimit: string;
}



export function PricingModal({ isOpen, onClose, currentLinksUsed }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  // const [showPaymentForm, setShowPaymentForm] = useState(false);

  const { userData  , setUserData} = useContext<any>(AuthContext);

  const onUpgrade = (plan: "pro" | "business") => {
    setUserData((prev : any)   =>
     prev ? { ...prev, subscriptionPlan: plan } : prev
    );
  };


  const plans: Record<'pro' | 'business', PlanFeatures> = {
    pro: {
      name: 'Pro',
      price: '₹9',
      period: '/month',
      description: 'Perfect for professionals and small businesses',
      linksLimit: '1,000 links/month',
      icon: <Zap className="h-6 w-6" />,
      popular: true,
      buttonText: 'Upgrade to Pro',
      features: [
        '1,000 links per month',
        'Advanced analytics & insights',
        'Custom branded domains',
        'QR code generation',
        'Link expiration settings',
        'Password protection',
        'Bulk link creation',
        'Email support'
      ]
    },
    business: {
      name: 'Business',
      price: '₹29',
      period: '/month',
      description: 'For teams and growing businesses',
      linksLimit: 'Unlimited links',
      icon: <Crown className="h-6 w-6" />,
      buttonText: 'Upgrade to Business',
      features: [
        'Unlimited links',
        'Advanced team analytics',
        'Multiple custom domains',
        'Team collaboration tools',
        'API access & integrations',
        'Advanced security features',
        'White-label solutions',
        'Priority phone & email support',
        'Custom reporting',
        'Single Sign-On (SSO)'
      ]
    }
  };

  const {  createOrder , verifyPayment , loadRazorpay  } = useContext(PaymentContext)

  const handleUpgrade = async () => {
  setIsProcessing(true);

  const loaded = await loadRazorpay();
  if (!loaded) {
    toast.error("Razorpay SDK failed");
    setIsProcessing(false);
    return;
  }

  try {
    const order = await createOrder(selectedPlan);

    const options = {
      key: order.key,
      amount: order.amount,
      currency: "INR",
      order_id: order.orderId,
      name: "Lnk.ly",
      description: `${selectedPlan} Plan Upgrade`,

      handler: async (response: any) => {
        try {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: userData._id, // ✅ THIS FIXES EVERYTHING
          });

          toast.success(`Upgraded to ${verifyRes.plan} 🎉`);
          onUpgrade(verifyRes.plan);
          onClose();
        } catch {
          toast.error("Payment verification failed");
        }
      },

      theme: { color: "#0ea5e9" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch {
    toast.error("Payment failed");
  } finally {
    setIsProcessing(false);
  }
};





  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            You've reached your free limit!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            You've created {currentLinksUsed} links. Upgrade to continue shortening URLs and unlock powerful features.
          </DialogDescription>
        </DialogHeader>

        {/* {!showPaymentForm ? ( */}
          <div className="space-y-6">
            {/* Current Usage Alert */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Free Plan Limit Reached</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've used all 10 free links. Choose a plan below to continue.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(plans).map(([key, plan]) => (
                <Card 
                  key={key}
                  className={`relative border-2 transition-all duration-300 cursor-pointer ${
                    selectedPlan === key 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50'
                  } ${plan.popular ? 'ring-2 ring-primary/20' : ''}`}
                  onClick={() => setSelectedPlan(key as 'pro' | 'business')}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-lg text-muted-foreground font-normal">
                        {plan.period}
                      </span>
                    </div>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                    <Badge variant="outline" className="w-fit mx-auto mt-2">
                      {plan.linksLimit}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Button 
                size="lg" 
                className="w-full h-12 text-lg"
                onClick={() => handleUpgrade()}
                disabled={isProcessing}
              >
                 {isProcessing ? "Processing..." : `Upgrade to ${plans[selectedPlan].name}`}
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  Secure payment
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-1">
                  <Headphones className="h-4 w-4" />
                  24/7 support
                </div>
              </div>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}