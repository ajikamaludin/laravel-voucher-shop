<x-mail::message>
# Hai, {{ $customer->name }}

## Welcome to {{ config('app.name', 'Voucher WBB') }}
Untuk mulai menggunakan layanan kami, harap aktifkan akun Anda dengan mengklik tombol aktivasi ini di bawah.

<x-mail::button url="{{ route('customer.active', $customer) }}">
    Aktivasi
</x-mail::button>


<div> jika tombol tidak berfungsi silakan klik tautan di bawah ini: </div>
<div>
    <a href="{{ route('customer.active', $customer) }}">
        {{ route('customer.active', $customer) }}
    </a>
</div>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>