import { PrismaClient, EquipmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding YNR Happy Homes PostgreSQL database...');

  // 1. Seed Official Company Information
  const company = await prisma.company.upsert({
    where: { id: 'ynr-company-main' },
    update: {
      name: 'YNR Happy Homes',
      establishedYear: 2025,
      location: 'IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, AP – 522510',
      address: 'IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510',
      phone: '7385293949',
      email: 'info@ynrhappyhomes.com',
      divisions: ['INFRA', 'REAL ESTATE', 'CONSTRUCTION'],
    },
    create: {
      id: 'ynr-company-main',
      name: 'YNR Happy Homes',
      establishedYear: 2025,
      location: 'IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, AP – 522510',
      address: 'IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510',
      phone: '7385293949',
      email: 'info@ynrhappyhomes.com',
      divisions: ['INFRA', 'REAL ESTATE', 'CONSTRUCTION'],
    },
  });

  console.log('Company info seeded:', company.name);

  // 2. Seed Initial Confirmed Equipment (Hyundai Smart Plus 210 Excavator, images = [])
  const equipment = await prisma.equipment.upsert({
    where: { id: 'eq-hyundai-210' },
    update: {
      name: 'Hyundai Smart Plus 210 Excavator',
      category: 'Excavator',
      brand: 'Hyundai',
      model: 'Smart Plus 210',
      description: 'Heavy-duty hydraulic crawler excavator engineered for high productivity earthmoving, site clearance, foundation trenching, and infrastructure development. Supplied with an experienced driver/operator.',
      images: [], // No stock/fake images
      specifications: {
        'Operating Weight': '21,200 kg',
        'Engine Power': '148 HP @ 1900 rpm',
        'Bucket Capacity': '0.92 m³',
        'Max Digging Depth': '6,730 mm',
        'Hydraulic System': 'Smart Plus Hydro-Control',
        'Operator': 'Provided by YNR Happy Homes',
      },
      operatorIncluded: true,
      rentalBasis: 'Hourly / Agreed duration',
      availabilityStatus: EquipmentStatus.AVAILABLE,
      serviceArea: 'Mangalagiri, Guntur District, Amaravati & Andhra Pradesh',
    },
    create: {
      id: 'eq-hyundai-210',
      name: 'Hyundai Smart Plus 210 Excavator',
      category: 'Excavator',
      brand: 'Hyundai',
      model: 'Smart Plus 210',
      description: 'Heavy-duty hydraulic crawler excavator engineered for high productivity earthmoving, site clearance, foundation trenching, and infrastructure development. Supplied with an experienced driver/operator.',
      images: [],
      specifications: {
        'Operating Weight': '21,200 kg',
        'Engine Power': '148 HP @ 1900 rpm',
        'Bucket Capacity': '0.92 m³',
        'Max Digging Depth': '6,730 mm',
        'Hydraulic System': 'Smart Plus Hydro-Control',
        'Operator': 'Provided by YNR Happy Homes',
      },
      operatorIncluded: true,
      rentalBasis: 'Hourly / Agreed duration',
      availabilityStatus: EquipmentStatus.AVAILABLE,
      serviceArea: 'Mangalagiri, Guntur District, Amaravati & Andhra Pradesh',
    },
  });

  console.log('Confirmed equipment seeded:', equipment.name);

  console.log('Database seeding finished cleanly with zero fictional data.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
