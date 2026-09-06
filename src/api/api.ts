import type { TSkillCategory } from '../slices/skillsSlice.ts';
import type { TSkillTag } from '../shared/ui/skillCard';
import type {
  TRequest,
  TRequestStatus
} from '../entites/request/model/types.ts';
import type { TSeenStatuses } from '../slices/requestStatusWatcherSlice.ts';
import { BadgeId } from '../entites/badge/model/types.ts';
export type TSkillCard = {
  id: number;
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
  cardId: number | null;
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

export const getSkills = (): Promise<TSkillCategory[]> =>
  fetch('/db/skills.json').then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось загрузить навыки');
    }
    return response.json();
  });

export const getSkillCards = (): Promise<TSkillCard[]> =>
  fetch('/db/skill-cards.json').then((res) => {
    if (!res.ok) {
      throw new Error('Не удалось загрузить карточки');
    }
    return res.json();
  });

export type TRegisterUser = {
  email: string;
  password: string;
};

export type TUser = {
  email: string;
  name?: string;
  city?: string;
};

export type TAuthResponse = {
  token: string;
  user: TUser;
};

const AUTH_MOCK_STORAGE_KEY = 'skillo_auth_mock_db';
const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export function register(registerData: TRegisterUser): Promise<TAuthResponse> {
  return delay().then(() => {
    if (!registerData.email || registerData.password.length < 6) {
      throw new Error('Некорректный email или пароль (минимум 6 символов)');
    }

    const authData: TAuthResponse = {
      token: 'token123',
      user: { email: registerData.email }
    };
    localStorage.setItem(AUTH_MOCK_STORAGE_KEY, JSON.stringify(authData));

    return authData;
  });
}
export function login(loginData: TRegisterUser): Promise<TAuthResponse> {
  return delay().then(() => {
    const saved = localStorage.getItem(AUTH_MOCK_STORAGE_KEY);
    const parsed: TAuthResponse | null = saved ? JSON.parse(saved) : null;

    if (!parsed || parsed.user.email !== loginData.email) {
      throw new Error('Пользователь с таким email не найден');
    }

    if (!loginData.password || loginData.password.length < 8) {
      throw new Error('Неверный пароль');
    }

    return parsed;
  });
}

export function getUser(token: string): Promise<TUser> {
  return delay().then(() => {
    if (!token) {
      throw new Error('Токен отсутствует');
    }

    const saved = localStorage.getItem(AUTH_MOCK_STORAGE_KEY);
    const parsed: TAuthResponse = saved ? JSON.parse(saved) : null;

    if (!parsed || parsed.token !== token) {
      throw new Error('Недействительный токен');
    }

    return parsed.user;
  });
}
export type TUpdateProfileData = Partial<TProfileState>;

export function updateProfile(
  profileData: TUpdateProfileData,
  token: string
): Promise<TProfileState> {
  return delay().then(() => {
    if (!token) {
      throw new Error('Токен отсутствует');
    }

    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    const currentProfile: TProfileState = savedProfile
      ? JSON.parse(savedProfile)
      : emptyProfile;

    const updatedProfile: TProfileState = {
      ...currentProfile,
      ...profileData
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));

    return updatedProfile;
  });
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
  return delay().then(() => readRequests());
}

export type TCreateRequestData = {
  skillId: number;
  skillName: string;
  fromUserId: number;
  toUserId: number;
  toUserName: string;
};

export function createRequest(data: TCreateRequestData): Promise<TRequest> {
  return delay().then(() => {
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
  return delay().then(() => {
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

const PROFILE_STORAGE_KEY = 'skillo_profile';

export function getProfile(): Promise<TProfileState> {
  return delay(100).then(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : emptyProfile;
    } catch {
      return emptyProfile;
    }
  });
}
const FAVORITES_STORAGE_KEY = 'skillo_favorites';
export const getFavorites = (): number[] => {
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
