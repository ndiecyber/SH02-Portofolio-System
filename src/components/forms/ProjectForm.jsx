import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, ShieldCheck, DollarSign, Image, Users, Info, Building2, Layers } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import * as clientApi from '../../services/clientApi';
import * as serviceApi from '../../services/serviceApi';
import * as technologyApi from '../../services/technologyApi';
import * as userApi from '../../services/userApi';
import * as teamApi from '../../services/teamApi';
import { PROJECT_STATUS } from '../../config/constants';

const ProjectForm = ({ initialData = {}, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for custom selectors
  const [selectedTech, setSelectedTech] = useState(initialData.technologyIds || []);
  const [selectedMembers, setSelectedMembers] = useState(initialData.memberIds || []);

  const [availableClients, setAvailableClients] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          clientApi.getClients(),
          serviceApi.getServices({ limit: 100 }),
        ]);
        setAvailableClients(clientsRes.clients || []);
        setAvailableServices(servicesRes.services || []);
      } catch {
        setAvailableClients([]);
      }

      try {
        const techs = await technologyApi.getTechnologies({ limit: 100 });
        setAvailableTechs(Array.isArray(techs) ? techs : techs?.data || []);
      } catch {
        setAvailableTechs([]);
      }

      try {
        const usersRes = await userApi.getUsers({ limit: 100 });
        setAvailableMembers(usersRes.users || []);
      } catch {
        setAvailableMembers([]);
      }

      try {
        const teams = await teamApi.getTeams();
        setAvailableTeams(Array.isArray(teams) ? teams : teams?.data || []);
      } catch {
        setAvailableTeams([]);
      }
    };
    loadOptions();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData.name || '',
      clientId: initialData.clientId || initialData.client_id || '',
      serviceId: initialData.serviceId || '',
      description: initialData.description || '',
      status: initialData.status || PROJECT_STATUS.PLANNING,
      budget: initialData.budget || '',
      startDate: initialData.startDate || '',
      endDate: initialData.endDate || '',
      thumbnail: initialData.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
      teamId: (Array.isArray(initialData.teamIds) && initialData.teamIds[0]) || initialData.teamId || '',
    },
  });

  const watchThumbnail = watch('thumbnail');

  const handleTechToggle = (techId) => {
    setSelectedTech((prev) =>
      prev.includes(techId) ? prev.filter((t) => t !== techId) : [...prev, techId]
    );
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        name: data.name,
        clientId: data.clientId,
        serviceId: data.serviceId,
        description: data.description,
        status: data.status,
        budget: data.budget,
        startDate: data.startDate,
        endDate: data.endDate,
        thumbnail: data.thumbnail,
        technologyIds: selectedTech,
        memberIds: selectedMembers,
        teamIds: data.teamId ? [data.teamId] : [],
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
              {...register('clientId', { required: 'Klien wajib dipilih' })}
            >
              <option value="">-- Pilih Klien Terdaftar --</option>
              {availableClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-xs text-rose-500 font-semibold">{errors.clientId.message}</p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="serviceId" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Layanan / Service <span className="text-rose-500">*</span>
            </label>
            <select
              id="serviceId"
              className="w-full bg-white text-slate-900 border border-slate-350 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
              {...register('serviceId', { required: 'Layanan wajib dipilih' })}
            >
              <option value="">-- Pilih Layanan --</option>
              {availableServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="text-xs text-rose-500 font-semibold">{errors.serviceId.message}</p>
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
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Right Side: Timeline & Thumbnail */}
        <div className="glass rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center text-left">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            Timelines
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="startDate"
              label="Start Date"
              type="date"
              variant="light"
              {...register('startDate')}
            />
            <Input
              id="endDate"
              label="End Date"
              type="date"
              variant="light"
              {...register('endDate')}
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

          <div className="space-y-1.5 text-left pt-2 border-t border-slate-100">
            <label htmlFor="teamId" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Responsible Team
            </label>
            <select
              id="teamId"
              className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
              {...register('teamId')}
            >
              <option value="">-- Tanpa Tim --</option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
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
              const isSelected = selectedTech.includes(tech.id);
              return (
                <button
                  type="button"
                  key={tech.id}
                  onClick={() => handleTechToggle(tech.id)}
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
            {availableTechs.length === 0 && (
              <p className="text-[10px] text-slate-400 font-bold col-span-full text-left">
                Belum ada data teknologi.
              </p>
            )}
          </div>
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
                      {(member.name || '??').substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{member.name}</p>
                      <p className="text-[9px] text-slate-500 font-semibold">{(member.role || '').replace(/_/g, ' ')}</p>
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
            {availableMembers.length === 0 && (
              <p className="text-[10px] text-slate-400 font-bold text-left">
                Belum ada data anggota tim.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 border-t border-slate-100 pt-4">
        <Button
          type="button"
          onClick={() => navigate('/projects')}
          variant="secondary"
          className="bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 px-6 font-bold"
        >
          <Layers className="w-4 h-4 mr-1" />
          Save Project Data
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
