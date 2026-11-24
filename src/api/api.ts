import type { TSkillCategory } from '../slices/skillsSlice.ts';
import type { TSkillTag } from '../shared/ui/skillCard';
import { createClient } from '@supabase/supabase-js';
import type {
  TRequest,
  TRequestStatus
} from '../entites/request/model/types.ts';
import type { TSeenStatuses } from '../slices/requestStatusWatcherSlice.ts';
import { BadgeId } from '../entites/badge/model/types.ts';

export type TCardId = string | number;

export type TSkillCard = {
  id: TCardId;
  name: string;
  avatar: string;
  city: string;
  age: number;
  gender: 'male' | 'female';
  bio: string;
  createdAt: string;
  likesCount: number;
  canTeach: TSkillTag[];
  wantsToLearn: TSkillTag[];
};

export type TProfileState = {
  name: string;
  avatar: string | null;
  birthDate: string;
  gender: 'any' | 'male' | 'female';
  city: string;
  description?: string;
  categoryId: string;
  subcategoryId: string;
  cardId: TCardId | null;
  canTeach: TSkillTag[] | null;
  wantsToLearn: TSkillTag[] | null;
};

export const emptyProfile: TProfileState = {
  name: '',
  avatar: null,
  birthDate: '',
  gender: 'any',
  city: '',
  description: '',
  categoryId: '',
  subcategoryId: '',
  cardId: null,
  canTeach: [],
  wantsToLearn: []
};

export type TRegisterUser = {
  email: string;
  password: string;
};

export type TRegisterFullPayload = TRegisterUser & {
  name: string;
  avatar: string | null;
  birthDate: string;
  gender: 'any' | 'male' | 'female';
  city: string;
  categoryId: string;
  subcategoryId: string;
  canTeach: TSkillTag[];
  wantsToLearn: TSkillTag[];
};

export type TUser = {
  id?: string;
  email: string;
  name?: string;
  city?: string;
};

export type TAuthResponse = {
  token: string;
  user: TUser;
};

export type TUpdateProfileData = Partial<TProfileState>;

export type TCreateRequestData = {
  skillId: number;
  skillName: string;
  fromUserId: TCardId;
  toUserId: TCardId;
  toUserName: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSkills = (): Promise<TSkillCategory[]> =>
  fetch('/db/skills.json').then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось загрузить навыки');
    }
    return response.json();
  });

const calcAge = (birthDate?: string | null): number => {
  if (!birthDate) return 18;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
};

export const getSkillCards = async (): Promise<TSkillCard[]> => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  let dbCards: TSkillCard[] = [];

  if (!error && profiles) {
    dbCards = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || 'Аноним',
      avatar: profile.avatar_url || 'https://via.placeholder.com/150',
      city: profile.city || 'Не указан',
      age: calcAge(profile.birth_date),
      gender: profile.gender === 'female' ? 'female' : 'male',
      bio: profile.description || '',
      createdAt: profile.created_at,
      likesCount: 0,
      canTeach: profile.can_teach || [],
      wantsToLearn: profile.wants_to_learn || []
    }));
  }

  try {
    const response = await fetch('/db/skill-cards.json');
    if (response.ok) {
      const mockCards = await response.json();
      return [...dbCards, ...mockCards];
    }
  } catch {
    return dbCards;
  }

  return dbCards;
};

export async function register(
  registerData: TRegisterFullPayload
): Promise<TAuthResponse> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: registerData.email,
    password: registerData.password
  });

  if (authError || !authData.user) {
    switch (authError?.code) {
      case 'user_already_exists':
        throw new Error('Пользователь с таким email уже зарегистрирован');
      case 'weak_password':
        throw new Error('Пароль слишком простой');
      case 'over_email_send_rate_limit':
        throw new Error('Слишком много попыток, попробуйте позже');
      default:
        throw new Error('Ошибка регистрации');
    }
  }

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    email: registerData.email,
    name: registerData.name,
    avatar_url: registerData.avatar,
    birth_date: registerData.birthDate || null,
    gender: registerData.gender,
    city: registerData.city,
    category_id: registerData.categoryId,
    subcategory_id: registerData.subcategoryId,
    can_teach: registerData.canTeach,
    wants_to_learn: registerData.wantsToLearn
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const sessionToken = authData.session?.access_token || 'supabase_token';

  return {
    token: sessionToken,
    user: {
      id: userId,
      email: registerData.email,
      name: registerData.name,
      city: registerData.city
    }
  };
}

export async function login(loginData: TRegisterUser): Promise<TAuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password
  });

  if (error || !data.session) {
    switch (error?.code) {
      case 'invalid_credentials':
        throw new Error('Неверный email или пароль');
      case 'email_not_confirmed':
        throw new Error('Подтвердите email, мы отправили вам письмо');
      case 'over_request_rate_limit':
        throw new Error('Слишком много попыток, попробуйте позже');
      default:
        throw new Error('Не удалось войти, попробуйте ещё раз');
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email || loginData.email,
      name: profile?.name,
      city: profile?.city
    }
  };
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('email_exists', {
    check_email: email
  });

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUser(token: string): Promise<TUser> {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Недействительный токен или сессия истекла');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name,
    city: profile?.city
  };
}

const mapProfileRow = (data: any): TProfileState => ({
  name: data.name || '',
  avatar: data.avatar_url ?? null,
  birthDate: data.birth_date || '',
  gender: data.gender || 'any',
  city: data.city || '',
  description: data.description || '',
  categoryId: data.category_id || '',
  subcategoryId: data.subcategory_id || '',
  cardId: data.id,
  canTeach: data.can_teach || [],
  wantsToLearn: data.wants_to_learn || []
});

export async function getProfile(): Promise<TProfileState> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return emptyProfile;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return emptyProfile;

  return mapProfileRow(data);
}

export async function updateProfile(
  profileData: TUpdateProfileData,
  token: string
): Promise<TProfileState> {
  const {
    data: { user }
  } = await supabase.auth.getUser(token);

  if (!user) {
    throw new Error('Пользователь не авторизован');
  }

  const dbPayload: Record<string, unknown> = {};
  if (profileData.name !== undefined) dbPayload.name = profileData.name;
  if (profileData.avatar !== undefined)
    dbPayload.avatar_url = profileData.avatar;
  if (profileData.birthDate !== undefined)
    dbPayload.birth_date = profileData.birthDate || null;
  if (profileData.gender !== undefined) dbPayload.gender = profileData.gender;
  if (profileData.city !== undefined) dbPayload.city = profileData.city;
  if (profileData.description !== undefined)
    dbPayload.description = profileData.description;
  if (profileData.categoryId !== undefined)
    dbPayload.category_id = profileData.categoryId;
  if (profileData.subcategoryId !== undefined)
    dbPayload.subcategory_id = profileData.subcategoryId;
  if (profileData.canTeach !== undefined)
    dbPayload.can_teach = profileData.canTeach;
  if (profileData.wantsToLearn !== undefined)
    dbPayload.wants_to_learn = profileData.wantsToLearn;

  const { data, error } = await supabase
    .from('profiles')
    .update(dbPayload)
    .eq('id', user.id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Профиль не найден или нет прав на его обновление');
  }

  return mapProfileRow(data);
}

export async function uploadSkillImages(files: File[]): Promise<string[]> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Пользователь не авторизован');

  return Promise.all(
    files.map(async (file) => {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from('skill-images')
        .upload(path, file, { contentType: file.type });

      if (error) throw new Error(error.message);

      return supabase.storage.from('skill-images').getPublicUrl(path).data
        .publicUrl;
    })
  );
}

const REQUESTS_STORAGE_KEY = 'skillo_requests';

const readRequests = (): TRequest[] => {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeRequests = (requests: TRequest[]) => {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
};

export function getRequests(): Promise<TRequest[]> {
  return Promise.resolve().then(() => readRequests());
}

export function createRequest(data: TCreateRequestData): Promise<TRequest> {
  return Promise.resolve().then(() => {
    const requests = readRequests();

    const newRequest: TRequest = {
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...data
    };

    writeRequests([...requests, newRequest]);
    return newRequest;
  });
}

export function updateRequestStatus(
  id: string,
  status: TRequestStatus
): Promise<TRequest> {
  return Promise.resolve().then(() => {
    const requests = readRequests();
    const index = requests.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error('Заявка не найдена');
    }

    const updated: TRequest = { ...requests[index], status };
    const next = [...requests];
    next[index] = updated;
    writeRequests(next);

    return updated;
  });
}

const FAVORITES_STORAGE_KEY = 'skillo_favorites';
export const getFavorites = (): TCardId[] => {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const getMarksIds = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const SEEN_STATUSES_KEY = 'skillo_seen_request_statuses';
export const getSeenStatuses = (): TSeenStatuses => {
  try {
    const raw = localStorage.getItem(SEEN_STATUSES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const UNLOCKED_STORAGE_KEY = 'skillo_unlocked_badges';
export const getUnlocked = (): BadgeId[] => {
  try {
    const raw = localStorage.getItem(UNLOCKED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
