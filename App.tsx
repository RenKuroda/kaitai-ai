
import React, { useState, useCallback } from 'react';
import { FileWithPreview, EstimationResult } from './types';
import { ImageUploadArea } from './components/ImageUploadArea';
import { ImagePreviewCard } from './components/ImagePreviewCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateDemolitionEstimate } from './services/geminiService';
import { DEMOLITION_ESTIMATE_PROMPT } from './constants';

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<FileWithPreview[]>([]);
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: FileWithPreview[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            id: crypto.randomUUID(),
            file: file,
            preview: reader.result as string,
          });
          // Check if all files are processed
          if (newImages.length === files.length) {
             setUploadedImages(prevImages => [...prevImages, ...newImages].slice(0, 10)); // Limit to 10 images
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleRemoveImage = useCallback((imageId: string) => {
    setUploadedImages(prevImages => prevImages.filter(img => img.id !== imageId));
  }, []);

  const getEstimate = useCallback(async () => {
    if (uploadedImages.length === 0) {
      setError("画像を1枚以上アップロードしてください。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEstimationResult(null);

    // Check for API key (it's expected to be in process.env)
    // This check is more illustrative in a frontend context as `process.env` is build-time.
    // In a real scenario, this key would be handled securely, possibly via a backend proxy.
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        setError("APIキーが設定されていません。環境変数 API_KEY を設定してください。");
        setIsLoading(false);
        // In a real app, you might want to log this or handle it differently.
        // For this exercise, we'll simulate the error as if the key was missing.
        // To make the app runnable without an actual API key for UI testing,
        // we can set a dummy key for process.env.
        // This is NOT secure for production.
        // For example, in your local .env file or terminal: export API_KEY="YOUR_ACTUAL_API_KEY"
        // If you are running this in an environment where process.env.API_KEY is not set,
        // you will see this error.
        console.error("APIキーが設定されていません。");
        // return; // Uncomment this line if you want to strictly enforce API key presence.
    }


    try {
      const imageParts = uploadedImages.map(img => ({
        inlineData: {
          mimeType: img.file.type,
          data: img.preview.split(',')[1], // Get base64 part
        },
      }));

      const resultText = await generateDemolitionEstimate(DEMOLITION_ESTIMATE_PROMPT, imageParts);
      setEstimationResult({ text: resultText });
    } catch (err) {
      console.error("Error getting estimation:", err);
      if (err instanceof Error) {
        setError(`現調中にエラーが発生しました: ${err.message}`);
      } else {
        setError("現調中に不明なエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          解体現調AI
        </h1>
        <p className="mt-2 text-lg text-slate-300">建物の写真をアップロードして、AIによる解体情報を取得します。</p>
      </header>

      <main className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
        <ImageUploadArea onImageUpload={handleImageUpload} disabled={isLoading || uploadedImages.length >= 10} />
        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-sky-400 mb-3">アップロードされた画像 ({uploadedImages.length}/10)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {uploadedImages.map(img => (
                <ImagePreviewCard key={img.id} image={img} onRemove={handleRemoveImage} disabled={isLoading} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={getEstimate}
            disabled={isLoading || uploadedImages.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            {isLoading ? '現調中...' : '解体現調する'}
          </button>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {estimationResult && !isLoading && <ResultsDisplay result={estimationResult} />}
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} 解体現調AI. Gemini API を利用しています。</p>
        <p className="mt-1">この算出結果はAIによる推定であり、実際とは異なる場合があります。正確な情報は専門業者にご相談ください。</p>
      </footer>
    </div>
  );
};

export default App;
