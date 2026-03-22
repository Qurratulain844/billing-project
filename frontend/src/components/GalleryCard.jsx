export default function GalleryCard({ image, name }) {
  return (
    <div className="bg-gray-100 rounded-3xl p-4 shadow-inner hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-2xl shadow-md mb-4"
      />
      <h3 className="text-gray-700 font-semibold text-lg text-center">{name}</h3>
    </div>
  );
}
