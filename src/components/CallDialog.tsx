import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    phone: string;
  };
  callType: 'voice' | 'video';
}

const CallDialog: React.FC<CallDialogProps> = ({ isOpen, onClose, contact, callType }) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setCallStatus('connecting');
      setDuration(0);
      return;
    }

    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
      toast({
        title: `${callType === 'video' ? 'Video' : 'Voice'} Call Connected`,
        description: `Connected to ${contact.name}`,
      });
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, [isOpen, callType, contact.name, toast]);

  useEffect(() => {
    if (callStatus === 'connected') {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    toast({
      title: 'Call Ended',
      description: `Call with ${contact.name} ended after ${formatDuration(duration)}`,
    });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callType === 'video' ? 'Video Call' : 'Voice Call'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {/* Contact Info */}
          <div>
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {contact.name[0]?.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-semibold">{contact.name}</h3>
            <p className="text-gray-500">{contact.phone}</p>
          </div>

          {/* Call Status */}
          <div>
            {callStatus === 'connecting' && (
              <div className="space-y-2">
                <div className="animate-pulse text-blue-600">Connecting...</div>
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
            
            {callStatus === 'connected' && (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">Connected</div>
                <div className="text-2xl font-mono">{formatDuration(duration)}</div>
              </div>
            )}
            
            {callStatus === 'ended' && (
              <div className="text-red-600 font-medium">Call Ended</div>
            )}
          </div>

          {/* Video Area (for video calls) */}
          {callType === 'video' && callStatus === 'connected' && (
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-white">Video Stream Placeholder</div>
              ) : (
                <div className="text-gray-400">
                  <VideoOff className="h-12 w-12 mx-auto mb-2" />
                  <p>Video Off</p>
                </div>
              )}
            </div>
          )}

          {/* Call Controls */}
          {callStatus === 'connected' && (
            <div className="flex justify-center gap-4">
              {/* Mute Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-100 text-red-600' : ''}`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              {/* Video Toggle (for video calls) */}
              {callType === 'video' && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`rounded-full h-12 w-12 ${!isVideoOn ? 'bg-red-100 text-red-600' : ''}`}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              )}

              {/* End Call Button */}
              <Button
                variant="destructive"
                size="icon"
                onClick={handleEndCall}
                className="rounded-full h-12 w-12"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          )}

          {callStatus === 'connecting' && (
            <Button variant="destructive" onClick={handleEndCall} className="w-full">
              Cancel Call
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;