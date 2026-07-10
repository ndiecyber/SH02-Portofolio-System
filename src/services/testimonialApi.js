import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getTestimonials = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let testimonials = mockDb.dbGetTestimonials();

    // Get logged-in user to check roles
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
      const role = user.role;
      const isAdmin = role === 'ADMIN' || role === 'CEO';
      const isPM = role === 'PROJECT_MANAGER';
      const isClient = role === 'CLIENT';
      const isIntern = role === 'INTERN';

      if (!isAdmin && !isPM) {
        if (isClient) {
          // Client: see published ones + testimonials they authored
          testimonials = testimonials.filter(
            (t) => t.status === 'Published' || t.clientName === user.clientName
          );
        } else if (isIntern) {
          if (user.magang_tier === 'JUNIOR') {
            // Junior Intern can see testimonials (published only)
            testimonials = testimonials.filter((t) => t.status === 'Published');
          } else {
            // Other interns: no access to testimonials
            testimonials = [];
          }
        } else {
          // Others: view published only
          testimonials = testimonials.filter((t) => t.status === 'Published');
        }
      }
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      testimonials = testimonials.filter(
        (t) => t.clientName.toLowerCase().includes(q) || t.quote.toLowerCase().includes(q)
      );
    }

    if (params.status) {
      testimonials = testimonials.filter((t) => t.status === params.status);
    }

    return {
      testimonials,
      total: testimonials.length
    };
  }

  const response = await api.get('/api/testimonials', { params });
  return response.data;
};

export const getTestimonial = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const testimonial = mockDb.dbGetTestimonial(id);
    if (!testimonial) throw new Error('Testimonial tidak ditemukan.');
    return testimonial;
  }

  const response = await api.get(`/api/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (testimonialData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTestimonial(testimonialData);
  }

  const response = await api.post('/api/testimonials', testimonialData);
  return response.data;
};

export const updateTestimonial = async (id, testimonialData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTestimonial({ ...testimonialData, id });
  }

  const response = await api.put(`/api/testimonials/${id}`, testimonialData);
  return response.data;
};

export const deleteTestimonial = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteTestimonial(id);
    return { success: true };
  }

  const response = await api.delete(`/api/testimonials/${id}`);
  return response.data;
};

export const publishTestimonial = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const test = mockDb.dbGetTestimonial(id);
    if (!test) throw new Error('Testimonial tidak ditemukan.');
    return mockDb.dbSaveTestimonial({ ...test, status: 'Published' });
  }

  const response = await api.put(`/api/testimonials/${id}/publish`);
  return response.data;
};

export const unpublishTestimonial = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const test = mockDb.dbGetTestimonial(id);
    if (!test) throw new Error('Testimonial tidak ditemukan.');
    return mockDb.dbSaveTestimonial({ ...test, status: 'Draft' });
  }

  const response = await api.put(`/api/testimonials/${id}/unpublish`);
  return response.data;
};
