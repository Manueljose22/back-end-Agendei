"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHospitalService = void 0;
class UpdateHospitalService {
    IHospitalsRepository;
    constructor(IHospitalsRepository) {
        this.IHospitalsRepository = IHospitalsRepository;
    }
    async execute(id, { address, email, name, phone }, images) {
        const hospital = await this.IHospitalsRepository.findById(id);
        let urls;
        if (!hospital) {
            throw new Error("Hospital não existe.");
        }
        if (Array.isArray(images)) {
            urls = images.map((url) => {
                return {
                    urlImagem: url
                };
            });
        }
        const newData = {
            name: name ?? hospital.name,
            address: address ?? hospital.address,
            email: email ?? hospital.email,
            phone: phone ?? hospital.phone
        };
        const newUrl = urls ?? hospital.images;
        await this.IHospitalsRepository.update(id, newData, newUrl);
    }
}
exports.UpdateHospitalService = UpdateHospitalService;
