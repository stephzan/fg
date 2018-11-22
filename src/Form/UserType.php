<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Translation\TranslatorInterface;

class UserType extends AbstractType
{
    public function __construct(TranslatorInterface $translator)
    {
        $this->tr = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, ['label' => $this->tr->trans('Email'), 'attr'=>['placeholder'=>$this->tr->trans('Email')]])
            ->add('username', TextType::class, ['label' => $this->tr->trans('Username'), 'attr'=>['placeholder'=>$this->tr->trans('Username')]])
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'first_options' => ['label' => $this->tr->trans('Password'), 'attr'=>['placeholder'=>$this->tr->trans('Password')]],
                'second_options' => ['label' => $this->tr->trans('Repeat Password'), 'attr'=>['placeholder'=>$this->tr->trans('Repeat Password')]],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
