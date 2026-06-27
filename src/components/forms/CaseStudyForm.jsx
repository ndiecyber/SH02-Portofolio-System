import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Info, Image, Tag } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import * as mockDb from '../../utils/mockDb';

const CaseStudyForm = ({ initialData = {}, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [availableProjects] = useState(mockDb.dbGetProjects());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      slug: initialData.slug || '',
      projectId: initialData.projectId || '',
      client: initialData.client || '',
      challenge: initialData.challenge || '',
      solution: initialData.solution || '',
      outcome: initialData.outcome || '',
      featuredImage: initialData.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      tagsString: initialData.tags ? initialData.tags.join(', ') : '',
      status: initialData.status || 'Draft',
    },
  });

  const watchTitle = watch('title');
  const watchProjectId = watch('projectId');
  const watchFeaturedImage = watch('featuredImage');

  // Auto-slug generator
  useEffect(() => {
    if (!initialData.slug && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  }, [watchTitle, setValue, initialData.slug]);

  // Auto-client filler based on selected project
  useEffect(() => {
    if (watchProjectId) {
      const project = availableProjects.find((p) => p.id === watchProjectId);
      if (project) {
        setValue('client', project.client);
      }
    }
  }, [watchProjectId, availableProjects, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Split tags
      const tags = data.tagsString
        ? data.tagsString
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t !== '')
        : [];

      const payload = {
        ...data,
        tags,
      };
      delete payload.tagsString;

      await onSubmitSuccess(payload);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan case study.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Alert type="error" message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Rich details form (Challenge, Solution, Outcome) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass rounded-xl p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
              <Info className="w-4 h-4 mr-2 text-blue-600" />
              Content Description
            </h3>

            <Input
              id="title"
              label="Case Study Title"
              placeholder="e.g. Scaling Enterprise shift scheduling by 200%"
              variant="light"
              error={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />

            <Input
              id="slug"
              label="URL Slug (Auto-generated)"
              placeholder="e.g. scaling-enterprise-shift-scheduling"
              variant="light"
              error={errors.slug?.message}
              {...register('slug', { required: 'Slug is required' })}
            />

            {/* Challenge */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="challenge" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                The Challenge
              </label>
              <textarea
                id="challenge"
                rows={4}
                placeholder="What was the business problem or client pain point?"
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-semibold"
                {...register('challenge', { required: 'Challenge context is required' })}
              />
              {errors.challenge && (
                <p className="text-xs text-red-500 font-semibold">{errors.challenge.message}</p>
              )}
            </div>

            {/* Solution */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="solution" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                The Solution
              </label>
              <textarea
                id="solution"
                rows={4}
                placeholder="How did our development team solve it?"
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-semibold"
                {...register('solution', { required: 'Solution is required' })}
              />
              {errors.solution && (
                <p className="text-xs text-red-500 font-semibold">{errors.solution.message}</p>
              )}
            </div>

            {/* Outcome */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="outcome" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                The Outcome
              </label>
              <textarea
                id="outcome"
                rows={4}
                placeholder="What metrics or growth highlights did the client experience?"
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-semibold"
                {...register('outcome', { required: 'Outcome description is required' })}
              />
              {errors.outcome && (
                <p className="text-xs text-red-500 font-semibold">{errors.outcome.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Project links and metadata */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
              <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
              Meta Connections
            </h3>

            {/* Project Link */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="projectId" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Linked Project Portfolio
              </label>
              <select
                id="projectId"
                className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
                {...register('projectId', { required: 'Project link is required' })}
              >
                <option value="">-- Choose Project --</option>
                {availableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-xs text-red-500 font-semibold">{errors.projectId.message}</p>
              )}
            </div>

            {/* Client (Disabled autofill preview) */}
            <Input
              id="client"
              label="Assigned Client"
              disabled
              placeholder="Auto-filled on project choice"
              variant="light"
              className="bg-slate-50 text-slate-500 font-semibold border-slate-200"
              {...register('client')}
            />

            {/* Tags String */}
            <Input
              id="tagsString"
              label="Case Study Tags (Comma separated)"
              placeholder="e.g. UX Redesign, Node.js, Scaling"
              icon={Tag}
              variant="light"
              {...register('tagsString')}
            />

            {/* Status */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Publish Status
              </label>
              <select
                id="status"
                className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                {...register('status')}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="glass rounded-xl p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
              <Image className="w-4 h-4 mr-2 text-blue-600" />
              Featured Cover Image
            </h3>

            <div className="space-y-3">
              <img
                src={watchFeaturedImage}
                alt="Featured Preview"
                className="w-full h-36 rounded-lg object-cover border border-slate-200 bg-slate-50"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <Input
                id="featuredImage"
                label="Cover Image URL Address"
                placeholder="Paste featured image url"
                variant="light"
                {...register('featuredImage')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 border-t border-slate-100 pt-4">
        <Button
          onClick={() => navigate('/case-studies')}
          variant="secondary"
          className="bg-white hover:bg-slate-50 text-slate-650 border border-slate-200 shadow-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 px-6 font-bold"
        >
          Save Case Study
        </Button>
      </div>
    </form>
  );
};

export default CaseStudyForm;
