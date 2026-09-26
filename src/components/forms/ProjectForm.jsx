import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, ShieldCheck, DollarSign, Image, Users, Info, Building2 } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import * as mockDb from '../../utils/mockDb';
import * as clientApi from '../../services/clientApi';
import { CATEGORIES, PROJECT_STATUS } from '../../config/constants';

const ProjectForm = ({ initialData = {}, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for custom selectors
  const [selectedTech, setSelectedTech] = useState(initialData.technologies || []);
  const [selectedMembers, setSelectedMembers] = useState(initialData.teamMembers || []);

  const [availableClients, setAvailableClients] = useState([]);
  const [availableTechs] = useState(mockDb.dbGetTechnologies());
  const [availableMembers] = useState(mockDb.dbGetTeamMembers());
  const [availableTeams] = useState(mockDb.dbGetTeams());

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await clientApi.getClients({ active: true });
        setAvailableClients(res.clients || []);
      } catch {
        setAvailableClients(mockDb.dbGetClients() || []);
      }
    };
    fetchClients();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData.name || '',
      clientId: initialData.clientId || initialData.client_id || '',
      clientName: initialData.clientName || initialData.client_name || '',
      description: initialData.description || '',
      category: initialData.category || CATEGORIES[0],
      status: initialData.status || PROJECT_STATUS.PLANNING,
      budget: initialData.budget || '',
      startDate: initialData.startDate || '',
      endDate: initialData.endDate || '',
      thumbnail: initialData.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
      teamId: initialData.teamId || 'team-a',
    },
  });

  const watchThumbnail = watch('thumbnail');

  const handleTechToggle = (techName) => {
    if (selectedTech.includes(techName)) {
      setSelectedTech(selectedTech.filter((t) => t !== techName));
    } else {
      setSelectedTech([...selectedTech, techName]);
    }
  };

  const handleMemberToggle = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const selectedClient = availableClients.find((c) => c.id === data.clientId);
      const resolvedClientName = selectedClient
        ? (selectedClient.company_name || selectedClient.name)
        : data.clientName;

      const payload = {
        ...data,
        clientId: data.clientId,
        client_id: data.clientId,
        clientName: resolvedClientName,
        budget: data.budget ? parseInt(data.budget, 10) : 0,
        technologies: selectedTech,
        teamMembers: selectedMembers,
      };
      await onSubmitSuccess(payload);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data proyek.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Alert type="error" message={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: General Info */}
        <div className="glass rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
            <Info className="w-4 h-4 mr-2 text-blue-600" />
            General Information
          </h3>

          <Input
            id="name"
            label="Project Name"
            placeholder="e.g. Mobile Banking Application"
            variant="light"
            error={errors.name?.message}
            {...register('name', { required: 'Project name is required' })}
          />

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label htmlFor="clientId" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Klien / Perusahaan <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/clients')}
                className="text-[11px] text-blue-600 hover:underline font-bold flex items-center space-x-1"
              >
                <Building2 className="w-3 h-3" />
                <span>+ Kelola Klien</span>
              </button>
            </div>
            <select
              id="clientId"
              className="w-full bg-white text-slate-900 border border-slate-350 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
              {...register('clientId', {
                required: 'Klien wajib dipilih',
                onChange: (e) => {
                  const selected = availableClients.find((c) => c.id === e.target.value);
                  if (selected) {
                    setValue('clientName', selected.company_name || selected.name);
                  }
                },
              })}
            >
              <option value="">-- Pilih Klien Terdaftar --</option>
              {availableClients.map((client) => {
                const label = client.company_name || client.name;
                return (
                  <option key={client.id} value={client.id}>
                    {label} {client.industry ? `(${client.industry})` : ''}
                  </option>
                );
              })}
            </select>
            {errors.clientId && (
              <p className="text-xs text-rose-500 font-semibold">{errors.clientId.message}</p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide a comprehensive project specification details..."
              className="w-full bg-white text-slate-900 border border-slate-350 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-semibold"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <select
                id="category"
                className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
                {...register('category')}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Project Status
              </label>
              <select
                id="status"
                className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
                {...register('status')}
              >
                {Object.values(PROJECT_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline & Team Assignments */}
        <div className="glass rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            Budget & Timelines
          </h3>

          <Input
            id="budget"
            label="Project Budget (IDR)"
            type="number"
            placeholder="e.g. 150000000"
            variant="light"
            icon={DollarSign}
            error={errors.budget?.message}
            {...register('budget')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="startDate"
              label="Start Date"
              type="date"
              variant="light"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Start date is required' })}
            />
            <Input
              id="endDate"
              label="End Date"
              type="date"
              variant="light"
              error={errors.endDate?.message}
              {...register('endDate', { required: 'End date is required' })}
            />
          </div>

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pt-2 pb-2 flex items-center text-left">
            <Image className="w-4 h-4 mr-2 text-blue-600" />
            Project Thumbnail
          </h3>

          <div className="flex items-center space-x-4">
            <img
              src={watchThumbnail}
              alt="Preview"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80';
              }}
            />
            <Input
              id="thumbnail"
              label="Image URL Address"
              placeholder="Paste thumbnail image URL address"
              variant="light"
              {...register('thumbnail')}
            />
          </div>
        </div>
      </div>

      {/* Team Assignment & Technologies Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technologies Checklist */}
        <div className="glass rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
            <Tag className="w-4 h-4 mr-2 text-blue-600" />
            Technologies Used
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableTechs.map((tech) => {
              const isSelected = selectedTech.includes(tech.name);
              return (
                <button
                  type="button"
                  key={tech.id}
                  onClick={() => handleTechToggle(tech.name)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {tech.name}
                </button>
              );
            })}
          </div>
          {selectedTech.length === 0 && (
            <p className="text-[10px] text-amber-600 font-extrabold text-left">⚠️ Harap pilih minimal satu teknologi.</p>
          )}
        </div>

        {/* Team Assignments Checklist */}
        <div className="glass rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            Assign Team Members
          </h3>

          <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {availableMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id);
              return (
                <button
                  type="button"
                  key={member.id}
                  onClick={() => handleMemberToggle(member.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-slate-50 border-blue-500/50 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-600 uppercase border border-slate-200">
                      {member.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{member.name}</p>
                      <p className="text-[9px] text-slate-500 font-semibold">{member.role.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-350'
                  }`}>
                    {isSelected && <ShieldCheck className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 text-left pt-2 border-t border-slate-100">
            <label htmlFor="teamId" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Responsible Team (Internship Isolation Scope)
            </label>
            <select
              id="teamId"
              className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
              {...register('teamId')}
            >
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 border-t border-slate-100 pt-4">
        <Button
          onClick={() => navigate('/projects')}
          variant="secondary"
          className="bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={selectedTech.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 px-6 font-bold"
        >
          Save Project Data
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
