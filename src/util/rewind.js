import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const eventRewindContext = (event) => {
    if (!event?.occurred_at || !dayjs(event.occurred_at).isValid()) return null;
    return {
        incidentTime: dayjs(event.occurred_at).utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        service: event.service || '',
        environment: event.environment || '',
    };
};

export const eventRewindUrl = (event) => {
    const context = eventRewindContext(event);
    return context ? `/rewind?${new URLSearchParams(context)}` : '/rewind';
};

export const readRewindContext = (search) => {
    const params = new URLSearchParams(search);
    const time = params.get('incidentTime');
    return {
        incidentTime: time && dayjs.utc(time).isValid()
            ? dayjs.utc(time).format('YYYY-MM-DDTHH:mm:ss.SSS')
            : dayjs().utc().format('YYYY-MM-DDTHH:mm'),
        service: params.get('service') || '',
        environment: params.get('environment') || '',
    };
};

export const rewindRequestParams = (context) => ({
    incidentAt: dayjs.utc(context.incidentTime).toISOString(),
    window: `${context.windowMinutes}m`,
    ...(context.service ? { service: context.service } : {}),
    ...(context.environment ? { environment: context.environment } : {}),
});

export const rewindOptions = (events, field, selected = '') =>
    [...new Set([...events.map(event => event[field]), selected].filter(Boolean))].sort();


const WINDOW_OPTIONS = [15, 30, 60, 120, 360, 1440];

// Optional deep-link state used by alert links (for example Slack incident cards):
//   window=60m | windowMinutes=60   lookback window (must be one of the Rewind options)
//   highlight=<change event id>     marks that change in the ranked list
//   run=1                           analyze immediately (needs incidentTime)
export const readRewindDeepLink = (search) => {
    const params = new URLSearchParams(search);
    const raw = (params.get('windowMinutes') || params.get('window') || '').trim();
    const match = /^(\d+)\s*(m|h)?$/i.exec(raw);
    const minutes = match ? Number(match[1]) * (match[2] && match[2].toLowerCase() === 'h' ? 60 : 1) : null;
    return {
        windowMinutes: WINDOW_OPTIONS.includes(minutes) ? minutes : null,
        highlight: params.get('highlight') || '',
        autorun: params.get('run') === '1' && !!params.get('incidentTime'),
    };
};
