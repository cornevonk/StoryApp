import { useState } from 'react'
import { Upload, FileText, Image, Table, Mic } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

export function ContextualDataInput({ onNext, onPrev }) {
  const [inputData, setInputData] = useState({
    text: '',
    files: [],
    urls: []
  })
  const { setContextualData } = useProject()

  const handleTextChange = (e) => {
    setInputData(prev => ({ ...prev, text: e.target.value }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setInputData(prev => ({ 
      ...prev, 
      files: [...prev.files, ...files] 
    }))
  }

  const handleNext = () => {
    setContextualData(inputData)
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuratie data
        </h2>
        <p className="text-gray-600">
          Voer informatie in die gebruikt wordt om uw pagina sjabloon te configureren
        </p>
      </div>

      <div className="space-y-8">
        {/* Text Input */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Tekst Input</h3>
          </div>
          <textarea
            value={inputData.text}
            onChange={handleTextChange}
            placeholder="Voer hier relevante tekst, bedrijfsinformatie, of andere context in die AI kan gebruiken om uw document aan te passen..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Tip: Hoe meer context u geeft, hoe beter AI uw document kan aanpassen
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Bestanden</h3>
          </div>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-blue transition-colors">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".txt,.pdf,.doc,.docx,.csv,.xlsx,.jpg,.jpeg,.png,.mp3,.wav"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Sleep bestanden hierheen of klik om te uploaden
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Ondersteunde formaten: PDF, Word, Excel, CSV, Afbeeldingen, Audio
              </p>
              <div className="inline-flex px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                Bestanden selecteren
              </div>
            </label>
          </div>

          {/* Uploaded Files */}
          {inputData.files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Geüploade bestanden:</h4>
              {inputData.files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Types Info */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wat kan AI ermee doen?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-brand-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Tekst</h4>
                <p className="text-sm text-gray-600">Genereert relevante content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Image className="w-5 h-5 text-brand-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Afbeeldingen</h4>
                <p className="text-sm text-gray-600">Selecteert passende visuals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Table className="w-5 h-5 text-brand-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Data</h4>
                <p className="text-sm text-gray-600">Maakt automatisch grafieken</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-brand-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Audio</h4>
                <p className="text-sm text-gray-600">Transcribeert naar tekst</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Vorige stap
        </button>
        
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Laat AI het sjabloon aanpassen
        </button>
      </div>
    </div>
  )
}