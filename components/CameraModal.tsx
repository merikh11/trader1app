import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import { XMarkIcon } from './icons/XMarkIcon';

interface CameraModalProps {
    onClose: () => void;
    onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture }) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    setError(t('camera.noDevice'));
                    return;
                }

                // Simplified camera request: let the browser choose the best camera.
                // This avoids issues on devices without a rear 'environment' camera (like laptops)
                // and is generally more compatible.
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err: any) {
                console.error("Error accessing camera:", err);
                if (err.name === 'NotAllowedError') {
                    setError(t('camera.permissionError'));
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    setError(t('camera.noDevice'));
                } else {
                    // A more generic error for other cases
                    setError(t('camera.permissionError'));
                }
            }
        };

        if (!capturedImage) {
           startCamera();
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [t, capturedImage]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
            }
        }
    };
    
    const handleUsePhoto = () => {
        if(capturedImage) {
            onCapture(capturedImage);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" dir={document.documentElement.dir ?? 'ltr'}>
            <div className="bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-brand-subtle hover:text-brand-text z-10">
                    <XMarkIcon className="w-7 h-7" />
                </button>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-brand-text mb-4 text-center">{t('camera.title')}</h3>
                    {error && <p className="text-brand-danger text-center mb-4">{error}</p>}
                    
                    <div className="bg-brand-primary rounded-md overflow-hidden aspect-video relative flex items-center justify-center">
                       {capturedImage ? (
                           <img src={capturedImage} alt="Captured trade setup" className="object-contain h-full w-full" />
                       ) : (
                           <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${error ? 'hidden' : ''}`}></video>
                       )}
                       {!capturedImage && !error && <div className="absolute inset-0 border-2 border-dashed border-brand-border/50"></div>}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                        {capturedImage ? (
                             <>
                                <button onClick={() => setCapturedImage(null)} className="w-full sm:w-auto flex-1 bg-brand-border text-brand-text font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all">
                                    {t('camera.captureAgain')}
                                </button>
                                <button onClick={handleUsePhoto} className="w-full sm:w-auto flex-1 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all">
                                    {t('camera.usePhoto')}
                                </button>
                             </>
                        ) : (
                            <button onClick={handleCapture} disabled={!!error} className="w-full bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-brand-subtle disabled:cursor-not-allowed">
                                {t('camera.capture')}
                            </button>
                        )}
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};