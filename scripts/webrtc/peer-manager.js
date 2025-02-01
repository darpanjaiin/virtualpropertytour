class PeerManager {
    constructor() {
        this.peer = null;
        this.currentCall = null;
        this.localStream = null;
        this.remoteStream = null;
        
        this.localVideo = document.getElementById('localVideo');
        this.remoteVideo = document.getElementById('remoteVideo');
        
        this.setupCallControls();
    }

    async initialize(userId) {
        this.peer = new Peer(userId, {
            config: {
                'iceServers': [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' }
                ]
            },
            debug: 3
        });

        this.peer.on('call', this.handleIncomingCall.bind(this));
        this.peer.on('error', this.handlePeerError.bind(this));

        // Get local stream
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            this.localVideo.srcObject = this.localStream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }

    async makeCall(remotePeerId) {
        if (!this.localStream) {
            console.error('Local stream not available');
            return;
        }

        const call = this.peer.call(remotePeerId, this.localStream);
        this.setupCallHandlers(call);
    }

    async handleIncomingCall(call) {
        if (!this.localStream) {
            console.error('Local stream not available');
            return;
        }

        call.answer(this.localStream);
        this.setupCallHandlers(call);
    }

    setupCallHandlers(call) {
        this.currentCall = call;

        call.on('stream', (remoteStream) => {
            this.remoteStream = remoteStream;
            this.remoteVideo.srcObject = remoteStream;
            document.getElementById('videoCallSection').classList.remove('hidden');
        });

        call.on('close', () => {
            this.endCall();
        });

        call.on('error', (error) => {
            console.error('Call error:', error);
            this.endCall();
        });
    }

    setupCallControls() {
        const toggleVideo = document.getElementById('toggleVideo');
        const toggleAudio = document.getElementById('toggleAudio');
        const endCall = document.getElementById('endCall');

        if (toggleVideo) {
            toggleVideo.addEventListener('click', () => {
                const videoTrack = this.localStream.getVideoTracks()[0];
                videoTrack.enabled = !videoTrack.enabled;
                toggleVideo.classList.toggle('disabled');
            });
        }

        if (toggleAudio) {
            toggleAudio.addEventListener('click', () => {
                const audioTrack = this.localStream.getAudioTracks()[0];
                audioTrack.enabled = !audioTrack.enabled;
                toggleAudio.classList.toggle('disabled');
            });
        }

        if (endCall) {
            endCall.addEventListener('click', () => this.endCall());
        }
    }

    endCall() {
        if (this.currentCall) {
            this.currentCall.close();
        }
        
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        this.currentCall = null;
        this.localStream = null;
        this.remoteStream = null;
        
        document.getElementById('videoCallSection').classList.add('hidden');
    }

    handlePeerError(error) {
        console.error('Peer error:', error);
        // Implement retry logic or user notification
    }
} 