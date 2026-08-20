import { IEquipmentRepository, IPropertyRepository, IProjectRepository, IEnquiryRepository, IUserRepository, IDashboardRepository, IAuthRepository } from './interfaces';
import { ApiEquipmentRepository } from './api/ApiEquipmentRepository';
import { ApiPropertyRepository } from './api/ApiPropertyRepository';
import { ApiProjectRepository } from './api/ApiProjectRepository';
import { ApiEnquiryRepository } from './api/ApiEnquiryRepository';
import { ApiUserRepository } from './api/ApiUserRepository';
import { ApiDashboardRepository } from './api/ApiDashboardRepository';
import { ApiAuthRepository } from './api/ApiAuthRepository';

// Active Repositories (Live REST API for Equipment, Property, Projects, Enquiries, Users, Dashboard & Auth)
export const equipmentRepository: IEquipmentRepository = new ApiEquipmentRepository();
export const propertyRepository: IPropertyRepository = new ApiPropertyRepository();
export const projectRepository: IProjectRepository = new ApiProjectRepository();
export const enquiryRepository: IEnquiryRepository = new ApiEnquiryRepository();
export const userRepository: IUserRepository = new ApiUserRepository();
export const dashboardRepository: IDashboardRepository = new ApiDashboardRepository();
export const authRepository: IAuthRepository = new ApiAuthRepository();

export * from './interfaces';
