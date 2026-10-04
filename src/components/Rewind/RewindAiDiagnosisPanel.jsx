import ScoreEvidence, { EvidenceValue } from '../Evidence/ScoreEvidence';
import { environmentLabel } from '../../util/console';
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Cpu, CheckCircle2, AlertCircle, FileCode, User, Database, GitCommit, Check, ChevronDown, Sliders, Clock } from 'lucide-react';
import { RiskScoreRing } from '../RiskScoreRing/RiskScoreRing';
import dayjs from 'dayjs';
import { toast } from '../ui/Toast';

const RewindAiDiagnosisPanel = ({ scoringResult, selectedEventId, queryParams }) => {
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [showFactors, setShowFactors] = useState(false);

  if (!scoringResult) {
    return (
      <div className="h-full border border-white/5 rounded-2xl bg-black/40 p-12 flex flex-col items-center justify-center text-center space-y-3 text-text-muted">
        <Sparkles size={28} className="text-accent/50 animate-pulse" />
        <h3 className="text-sm font-semibold text-white">AI Diagnosis Standby</h3>
        <p className="text-xs max-w-sm leading-relaxed">
          Select an incident timestamp and click <span className="text-accent font-semibold">Analyze</span> to generate live root-cause intelligence.
        </p>
      </div>
    );
  }

  const individualScores = scoringResult.individual_scores || scoringResult.individualScores || [];

  if (!individualScores || individualScores.length === 0) {
    return (
      <div className="h-full border border-white/5 rounded-2xl bg-black/40 p-12 flex flex-col items-center justify-center text-center space-y-3 text-text-muted">
        <Clock size={28} className="text-accent/60" />
        <h3 className="text-sm font-semibold text-white">No Change Events Found</h3>
        <p className="text-xs max-w-sm leading-relaxed">
          No events in past <span className="text-accent font-mono font-bold">{queryParams?.windowMinutes || 30} minutes</span>.
        </p>
      </div>
    );
  }

  const aiDiagnosis = scoringResult.ai_diagnosis || scoringResult.aiDiagnosis || null;
  const overallAssessment = scoringResult.overall_assessment || scoringResult.overallScore || {};
  const overallScore = typeof overallAssessment.score === 'number' ? overallAssessment.score : null;
  const overallLevel = overallAssessment.level || 'low';
  const explanation = aiDiagnosis?.executive_summary || overallAssessment.explanation || 'Analysis complete.';
  const overallRecommendations = overallAssessment.recommendations || scoringResult.recommendations || [];
  const correlations = scoringResult.correlations || [];
  const summaryStats = scoringResult.summary || {};

  // Find selected event
  const selectedItem = individualScores.find(i => (i.event?.id || i.id) === selectedEventId) || individualScores[0];
  const selectedEvent = selectedItem?.event || selectedItem;
  
  // Scored item structure check (support risk_assessment, riskAssessment, score)
  const selectedRiskAssessment = selectedItem?.risk_assessment || selectedItem?.riskAssessment || selectedItem?.score || {};
  const selectedScoreValue = typeof selectedRiskAssessment.score === 'number' ? selectedRiskAssessment.score : (typeof selectedItem?.score === 'number' ? selectedItem.score : 0);
  const selectedLevel = selectedRiskAssessment.level || selectedItem?.level || 'low';
  const selectedExplanation = selectedRiskAssessment.explanation || selectedItem?.explanation || '';
  const selectedFactors = selectedRiskAssessment.factors || selectedItem?.factors || [];
  const selectedRecommendations = selectedRiskAssessment.recommendations || selectedItem?.recommendations || [];

  // Deduplicated list of all recommendations (overall + selected event)
  const allRecommendations = Array.from(new Set([...overallRecommendations, ...selectedRecommendations]));

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-rose-500/20 border-rose-500/30 text-rose-400';
      case 'high': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'medium': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default: return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
    }
  };

  const getScoreBadgeColor = (score, level) => {
    if (score >= 70 || level === 'critical') return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (score >= 45 || level === 'medium' || level === 'high') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="flex flex-col max-h-[750px] bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Sticky Header */}
      <div className="p-5 border-b border-white/10 bg-black/90 backdrop-blur-xl sticky top-0 z-20 flex items-start justify-between shrink-0 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-widest ${getLevelColor(overallLevel)}`}>
              {overallLevel} RISK LEVEL
            </span>
            {queryParams?.service && (
              <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                Service: {queryParams.service}
              </span>
            )}
            {summaryStats.correlations_found > 0 && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                {summaryStats.correlations_found} Correlations Detected
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className={overallLevel === 'critical' ? 'text-rose-500 animate-pulse' : 'text-amber-400'} size={18} />
            AI Change Investigation
          </h2>
          <p className="text-xs text-text-muted">
            Incident Window: <span className="text-white font-mono">{queryParams?.windowMinutes || 30}m</span> | Target Time: <span className="text-white font-mono">{dayjs.utc(queryParams?.incidentTime).format('YYYY-MM-DD HH:mm:ss [UTC]')}</span>
          </p>
        </div>

        <div className="w-14 h-14 shrink-0 flex flex-col items-center justify-center">
          <RiskScoreRing score={overallScore} level={overallLevel} radius={26} stroke={4} />
              <span className="text-[10px] text-text-muted">Risk /100</span>
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
        <ScoreEvidence assessment={overallAssessment} label="Overall risk score: rationale and evidence" />
        <ScoreEvidence assessment={selectedRiskAssessment} eventId={selectedEvent?.id} label="Selected change: rationale and source evidence" />
        {/* AI Summary Banner */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
              <Sparkles size={14} className="animate-pulse" />
              Executive AI Analysis
            </div>
            {summaryStats.total_events_analyzed != null && (
              <span className="text-[10px] font-mono text-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                Analyzed {summaryStats.total_events_analyzed} events
              </span>
            )}
          </div>

          {aiDiagnosis?.primary_cause_headline && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-bold text-rose-300 flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-400 shrink-0" />
              <span>{aiDiagnosis.primary_cause_headline}</span>
            </div>
          )}

          <p className="text-xs text-text-secondary leading-relaxed">
            {explanation}
          </p>

          {aiDiagnosis?.recommended_action && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-300 flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-[10px] uppercase font-mono tracking-wider">Recommended Action:</strong>
                {aiDiagnosis.recommended_action}
              </div>
            </div>
          )}
        </div>

        {/* Selected Event Focus Card */}
        {selectedEvent && (
          <div className="space-y-3 bg-black/30 p-4 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted flex items-center gap-1">
                <FileCode size={12} className="text-accent" /> Selected Change Event Focus
              </span>
              {selectedItem?.role && (
                <span className={`text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded border ${
                  selectedItem.role === 'primary' 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {selectedItem.role === 'primary' ? 'Suspected contributor' : 'Possible contributor'} {selectedItem.causal_position != null ? `#${selectedItem.causal_position}` : ''}
                </span>
              )}
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {selectedEvent.summary || `${selectedEvent.type} on ${selectedEvent.service}`}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="font-mono text-accent">{selectedEvent.service}</span>
                    <span>•</span>
                    <span>{environmentLabel(selectedEvent.environment)}</span>
                    {selectedEvent.meta?.author && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-white">
                          <User size={10} /> {selectedEvent.meta.author}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${getScoreBadgeColor(selectedScoreValue, selectedLevel)}`}>
                  Risk: {selectedScoreValue ?? "Not supplied"}/100 ({selectedLevel.toUpperCase()})
                </span>
              </div>
              
              {selectedExplanation && (
                <p className="text-[11px] text-text-secondary leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  {selectedExplanation}
                </p>
              )}

              {/* Factors breakdown - Collapsible for noise reduction */}
              {selectedFactors.length > 0 && (
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowFactors(!showFactors)}
                    className="flex items-center justify-between w-full py-1 text-[10px] uppercase font-mono text-text-muted hover:text-accent transition-colors"
                  >
                    <span className="flex items-center gap-1 font-semibold">
                      <Sliders size={12} className="text-accent" />
                      {showFactors ? 'Hide API Risk Factors' : `Why this score? (View ${selectedFactors.length} Risk Factors)`}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showFactors ? 'rotate-180 text-accent' : ''}`} />
                  </button>

                  {showFactors && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      {selectedFactors.map((f, i) => {
                        const pts = f.score;
                        return (
                          <div key={i} className="bg-white/5 border border-white/5 p-2.5 rounded-lg text-[11px] space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                {f.name}
                              </span>
                              <div className="flex items-center gap-2">
                                {f.weight != null && (
                                  <span className="text-[10px] text-text-muted">Weight: {f.weight}</span>
                                )}
                                <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                                  {pts}/100
                                </span>
                              </div>
                            </div>
                            {f.description && (
                              <p className="text-[10px] text-text-secondary leading-snug">{f.description}</p>
                            )}
                            {f.evidence && f.evidence.length > 0 && (
                              <ul className="pl-3 pt-1 space-y-0.5 list-disc text-[10px] text-text-muted marker:text-accent/60">
                                {f.evidence.map((ev, evIdx) => (
                                  <li key={evIdx}><EvidenceValue value={ev} /></li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Correlated Changes */}
        {correlations.length > 0 && (
          <div className="space-y-3 bg-white/[0.01] p-4 border border-white/5 rounded-xl">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Cpu size={14} className="text-accent" />
              Correlated Change Signals ({correlations.length})
            </h3>
            <div className="space-y-2">
              {correlations.map((corr, idx) => (
                <div key={idx} className="p-3 bg-black/50 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-white">{corr.description}</div>
                    <div className="text-[10px] text-text-muted">
                      Confidence: <span className="text-accent font-mono font-bold">{corr.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                      +{corr.riskIncrease} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actionable SRE Next Steps & Recommendations */}
        {allRecommendations.length > 0 && (
          <div className="space-y-3 p-4 bg-gradient-to-b from-black/40 to-black/60 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Actionable SRE Next Steps & Recommendations ({allRecommendations.length})
              </h3>
            </div>
            
            <div className="space-y-2">
              {allRecommendations.map((rec, idx) => {
                const isUrgent = rec.toLowerCase().includes('urgent') || rec.toLowerCase().includes('emergency') || rec.toLowerCase().includes('rollback');
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      isUrgent
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                        : 'bg-black/50 border-white/10 hover:border-white/20 text-text-primary'
                    }`}
                  >
                    <div className={`p-1 rounded-md shrink-0 mt-0.5 ${isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-accent/10 text-accent'}`}>
                      {isUrgent ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-medium leading-relaxed">
                        {rec}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewindAiDiagnosisPanel;
