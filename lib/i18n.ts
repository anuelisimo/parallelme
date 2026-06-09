export type Lang = 'es' | 'en';

export const translations = {
  es: {
    // Nav
    nav_feed: 'línea',
    nav_people: 'presencias',
    nav_messages: 'señales',
    nav_create: '+',

    // Feed
    feed_active: 'línea activa',
    feed_presences: 'presencias',
    feed_empty: 'no hay más señales por ahora',
    feed_gazes: 'miradas',
    feed_echoes: 'ecos',

    // People
    people_title: 'presencias',
    people_subtitle: 'en la red',
    people_following: 'líneas que seguís',
    people_others: 'otras presencias',
    status_active: 'activo',
    status_unstable: 'inestable',
    status_dormant: 'quieto',
    status_expanding: 'en expansión',

    // Person profile
    person_follow: 'seguir línea',
    person_unfollow: 'dejando de observar',
    person_signals: 'señales anteriores',

    // Messages
    messages_title: 'mensajes',
    messages_subtitle: 'señales privadas',
    messages_unknown: 'desconocido',
    messages_origin: 'origen desconocido',
    messages_network: 'red',

    // Create
    create_title: 'crear presencia',
    create_subtitle: 'nueva línea',
    create_desc: 'Definís el origen. La red hace el resto.',
    create_name: 'nombre',
    create_city: 'lugar',
    create_signal: 'primera señal',
    create_signal_placeholder: '¿Qué está haciendo ahora mismo?',
    create_difference: 'la decisión que lo diferencia',
    create_tone: 'tono narrativo',
    create_color: 'color de línea',
    create_submit: 'activar línea',
    create_success: 'Acaba de aparecer en la red.\nTodavía no hay señal.',
    create_back: 'volver a la línea',
    create_another: 'crear otro',
    tone_everyday: 'cotidiano',
    tone_everyday_desc: 'lo ordinario con tensión invisible',
    tone_unsettling: 'inquietante',
    tone_unsettling_desc: 'ironía bajo la superficie',
    tone_philosophical: 'filosófico',
    tone_philosophical_desc: 'el yo observa el mundo',
    tone_melancholic: 'melancólico',
    tone_melancholic_desc: 'memoria fragmentada',
    diff_left_city: 'se fue de la ciudad',
    diff_chose_other: 'eligió otra cosa',
    diff_said_yes: 'dijo que sí',
    diff_didnt_return: 'no volvió',
    diff_dared: 'se animó antes',
    diff_night: 'vive de noche',

    // Glitch questions
    glitch_1: '¿por qué volviste hoy?',
    glitch_2: '¿lo reconocés?',
    glitch_3: '¿o sos vos?',
    glitch_4: 'semejanza',
    glitch_5: '¿cuándo fue la última vez que tomaste una decisión así?',

    // Lang selector
    lang_label: 'idioma',
  },
  en: {
    // Nav
    nav_feed: 'line',
    nav_people: 'presences',
    nav_messages: 'signals',
    nav_create: '+',

    // Feed
    feed_active: 'active line',
    feed_presences: 'presences',
    feed_empty: 'no more signals for now',
    feed_gazes: 'gazes',
    feed_echoes: 'echoes',

    // People
    people_title: 'presences',
    people_subtitle: 'in the network',
    people_following: 'lines you follow',
    people_others: 'other presences',
    status_active: 'active',
    status_unstable: 'unstable',
    status_dormant: 'quiet',
    status_expanding: 'expanding',

    // Person profile
    person_follow: 'follow line',
    person_unfollow: 'stop observing',
    person_signals: 'previous signals',

    // Messages
    messages_title: 'messages',
    messages_subtitle: 'private signals',
    messages_unknown: 'unknown',
    messages_origin: 'unknown origin',
    messages_network: 'network',

    // Create
    create_title: 'create presence',
    create_subtitle: 'new line',
    create_desc: 'You define the origin. The network does the rest.',
    create_name: 'name',
    create_city: 'place',
    create_signal: 'first signal',
    create_signal_placeholder: 'What are they doing right now?',
    create_difference: 'the decision that sets them apart',
    create_tone: 'narrative tone',
    create_color: 'line color',
    create_submit: 'activate line',
    create_success: 'Just appeared in the network.\nNo signal yet.',
    create_back: 'back to the line',
    create_another: 'create another',
    tone_everyday: 'everyday',
    tone_everyday_desc: 'the ordinary with invisible tension',
    tone_unsettling: 'unsettling',
    tone_unsettling_desc: 'irony beneath the surface',
    tone_philosophical: 'philosophical',
    tone_philosophical_desc: 'the self observing the world',
    tone_melancholic: 'melancholic',
    tone_melancholic_desc: 'fragmented memory',
    diff_left_city: 'left the city',
    diff_chose_other: 'chose something else',
    diff_said_yes: 'said yes',
    diff_didnt_return: 'never went back',
    diff_dared: 'dared sooner',
    diff_night: 'lives at night',

    // Glitch questions
    glitch_1: 'why did you come back today?',
    glitch_2: 'do you recognize them?',
    glitch_3: 'or is it you?',
    glitch_4: 'similarity',
    glitch_5: 'when was the last time you made a decision like that?',

    // Lang selector
    lang_label: 'language',
  },
} as const;

export type TranslationKey = keyof typeof translations['es'];

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] ?? translations['es'][key] ?? key;
}
