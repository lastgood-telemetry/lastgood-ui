import ScoreEvidence from '../Evidence/ScoreEvidence';
import { environmentLabel } from '../../util/console';
import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, Copy, User, ExternalLink, ArrowRight, Sparkles, Terminal, FileCode, Check, RefreshCw, Clock } from 'lucide-react';
import { RiskScoreRing } from '../RiskScoreRing/RiskScoreRing';
import dayjs from 'dayjs';
import { toast } from '../ui/Toast';

export const RewindIncidentBrief = ({ scoringResult, queryParams, onSwitchToDetailed }) => {
  if (!scoringResult) return null;

  const aiDiagnosis = scoringResult.ai_diagnosis || scoringResult.aiDiagnosis || null;
  const overallAssessment = scoringResult.overall_assessment || scoringResult.overallScore || {};
  const overallScore = typeof overallAssessment.score === 'number' ? overallAssessment.score : null;
  const overallLevel = overallAssessment.level || 'critical';
  const overallExplanation = aiDiagnosis?.executive_summary || overallAssessment.explanation || 'Changes ranked for investigation. Confirm any suspected contributor against incident evidence.';
  const overallRecommendations = overallAssessment.recommendations || scoringResult.recommendations || [];
  const correlations = scoringResult.correlations || [];
  const summaryStats = scoringResult.summary || {};
  const items = scoringResult.individual_scores || scoringResult.individualScores || [];

  if (!items || items.length === 0) {
    return (
      <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center space-y-3 bg-[#0b0f0d]/40 max-w-5xl mx-auto">
        <Clock size={28} className="text-accent/60 mx-auto" />
        <h3 className="text-sm font-semibold text-white">No Change Events Found</h3>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          No events in past <span className="text-accent font-mono font-bold">{queryParams?.windowMinutes || 30} minutes</span>.
        </p>
      </div>
    );
  }

  // Identify Primary Trigger Event
  const primaryItem = items.find(i => i.role === 'primary') || items[0] || {};
  const primaryEvent = primaryItem.event || primaryItem || {};
  const primaryMeta = primaryEvent.meta || {};
  const primaryAuthor = primaryMeta.author || primaryEvent.source || 'CI/CD';
  const primaryService = primaryEvent.service || 'unknown';
  const primaryEnv = primaryEvent.environment || 'prod';
  const primarySummary = primaryEvent.summary || primaryEvent.type || 'Infrastructure change';
  const primaryTime = primaryEvent.occurred_at ? dayjs(primaryEvent.occurred_at).utc().format('HH:mm:ss UTC') : 'Unknown';

  // Primary risk assessment details
  const primaryRiskAssessment = primaryItem.risk_assessment || primaryItem.riskAssessment || primaryItem.score || {};
  const primaryRecommendations = primaryRiskAssessment.recommendations || [];

  // Deduplicate all recommendations
  const allRecommendations = Array.from(new Set([...overallRecommendations, ...primaryRecommendations]));

  const getLevelBadge = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-500/20 border-rose-500/40 text-rose-400';
      case 'high':
        return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
      case 'medium':
        return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
      default:
        return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Executive Summary Spotlight Banner */}
      <div className="bg-[#0b0f0d]/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-accent"></div>
        
        {/* Header Bar */}
        <div className="p-4 md:p-6 border-b border-white/5 bg-gradient-to-r from-rose-500/10 via-black/40 to-transparent flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 border rounded text-[10px] font-bold uppercase tracking-widest ${getLevelBadge(overallLevel)}`}>
                {overallLevel} RISK LEVEL
              </span>
              <span className="text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                Primary Target: {primaryService} ({environmentLabel(primaryEnv)})
              </span>
              {correlations.length > 0 && (
                <span className="hidden md:inline text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {correlations.length} Risk Correlations
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <ShieldAlert className="text-rose-500 animate-pulse" size={22} />
              AI Incident Diagnosis Brief
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 flex flex-col items-center justify-center">
              <RiskScoreRing score={overallScore} level={overallLevel} radius={28} stroke={4} />
              <span className="text-[10px] text-text-muted">Risk /100</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block px-6 pt-4"><ScoreEvidence assessment={overallAssessment} label="Overall risk score: rationale and evidence" /></div>
        {/* The 2-Paragraph Core Incident Brief Body */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 bg-[#0b0f0d]/40">
          
          {/* AI Primary Cause Headline (if returned from AI backend) */}
          {aiDiagnosis?.primary_cause_headline && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-rose-300">
                <Sparkles size={16} className="text-rose-400 animate-pulse shrink-0" />
                <span>{aiDiagnosis.primary_cause_headline}</span>
              </div>
            </div>
          )}

          {/* Paragraph 1: WHAT HAPPENED */}
          <div className="space-y-2.5 bg-[#0b0f0d]/60 border border-white/10 p-4 md:p-5 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
              <Sparkles size={16} className="text-accent animate-pulse" />
              1. What Happened
            </div>
            <p className="text-xs md:text-sm text-text-primary leading-relaxed">
              <strong className="text-white font-semibold">{primarySummary}</strong> was applied to <span className="text-accent font-mono">{primaryService}</span> (<span className="text-white">{environmentLabel(primaryEnv)}</span>) by <span className="text-white font-medium">@{primaryAuthor}</span> at <span className="font-mono text-white">{primaryTime}</span>. {overallExplanation}
            </p>

            {/* Primary Event Metadata Pill */}
            {primaryMeta && (
              <div className="hidden md:flex pt-2 flex-wrap items-center gap-3 text-[11px] text-text-muted border-t border-white/5">
                {primaryMeta.commit && (
                  <span className="font-mono text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    Commit: <span className="text-accent font-bold">{primaryMeta.commit.substring(0, 7)}</span>
                  </span>
                )}
                {primaryMeta.version && (
                  <span className="font-mono text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    Version: <span className="text-white">{primaryMeta.version}</span>
                  </span>
                )}
                {primaryMeta.tables_affected && (
                  <span className="font-mono text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    Tables: <span className="text-white">{primaryMeta.tables_affected.join(', ')}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Paragraph 2: WHAT TO DO RIGHT NOW */}
          <div className="space-y-3 bg-gradient-to-b from-black/60 to-black/80 border border-emerald-500/20 p-4 md:p-5 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 size={16} className="text-emerald-400" />
                2. What To Do Right Now (SRE Playbook)
              </div>
              <span className="hidden md:inline text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Action Required
              </span>
            </div>

            <div className="space-y-2.5">
              {aiDiagnosis?.recommended_action && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-xl flex items-start gap-3 text-rose-200 text-xs md:text-sm font-semibold shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                  <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block font-bold">AI Recommended Mitigation</span>
                    <p className="leading-relaxed">{aiDiagnosis.recommended_action}</p>
                  </div>
                </div>
              )}

              {allRecommendations.length > 0 ? (
                allRecommendations.map((rec, idx) => {
                  const isUrgent = rec.toLowerCase().includes('urgent') || rec.toLowerCase().includes('emergency') || rec.toLowerCase().includes('rollback');
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        isUrgent
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                          : 'bg-[#0b0f0d]/50 border-white/10 text-text-primary'
                      }`}
                    >
                      <div className={`p-1 rounded-md shrink-0 mt-0.5 ${isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {isUrgent ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-xs md:text-sm font-medium leading-relaxed">
                          {rec}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 bg-[#0b0f0d]/40 border border-white/10 rounded-xl text-xs text-text-secondary">
                  Investigate logs for <span className="text-accent font-mono">{primaryService}</span> and coordinate rollback with change author @{primaryAuthor}.
                </div>
              )}
            </div>
          </div>

          {/* Quick 1-Click Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  toast.info(`Contact change author: ${primaryAuthor}`);
                }}
                className="hidden md:flex bg-accent hover:opacity-90 text-[#101413] font-bold px-4 py-2 rounded-xl items-center gap-2 text-xs transition-all shadow-lg shadow-accent/15"
              >
                <User size={14} />
                <span>Contact Author (@{primaryAuthor})</span>
              </button>

              {primaryMeta.commit && (
                <a
                  href={primaryMeta.commit_url || `https://github.com/search?q=${primaryMeta.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto justify-center bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold px-4 py-2.5 md:py-2 rounded-xl flex items-center gap-2 text-xs transition-all"
                >
                  <ExternalLink size={14} className="text-accent" />
                  <span>View Commit ({primaryMeta.commit.substring(0, 7)})</span>
                </a>
              )}
            </div>

            {/* Switch to Detailed View Link */}
            <button
              type="button"
              onClick={onSwitchToDetailed}
              className="hidden md:flex text-xs font-semibold text-accent hover:underline items-center gap-1.5 ml-auto"
            >
              <span>Need deep evidence & timelines? Switch to Full Breakdown</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RewindIncidentBrief;
